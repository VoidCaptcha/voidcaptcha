import '../scss/index.scss';

import type { 
    VoidCaptcha_ActiveProvider,
    VoidCaptcha_BaseProvider,
    VoidCaptcha_BotScore,
    VoidCaptcha_Config, 
    VoidCaptcha_Events, 
    VoidCaptcha_LocaleStrings, 
    VoidCaptcha_PassiveProvider, 
    VoidCaptcha_Selector
} from "../types";

type VoidCaptcha_RequiredConfig = {providers: VoidCaptcha_Config['providers'], url: VoidCaptcha_Config['callbackUrl']} & Partial<VoidCaptcha_Config>;

const VoidCaptcha = (function(config: VoidCaptcha_RequiredConfig) {
    const score: VoidCaptcha_BotScore = {
        current: config.botScore || 20,
        required: config.botScoreRequired || 5,

        increase(num: number) {
            this.current += num;
        },
        
        decrease(num: number) {
            this.current -= num;
        },

        valid(): boolean {
            return this.current <= this.required;
        }
    };

    return new (class VoidCaptchaInstance {

        /**
         * Default Configuration
         */
        static get config(): VoidCaptcha_Config {
            let locale = [...navigator.languages] || ['en'];
            return {
                botScore: 20,
                botScoreRequired: 5,
                callbackHeaders: null,
                callbackUrl: null,
                callToValidate: false,
                locale,
                providers: null
            }
        }

        /**
         * Instance Configuration
         */
        private config: VoidCaptcha_Config;

        /**
         * Instance Event Listeners
         */
        private events: { [key: string]: Array<(captcha: VoidCaptchaInstance, root: HTMLElement) => void> };

        /**
         * Active Providers
         */
        private active: VoidCaptcha_ActiveProvider[];

        /**
         * Passive Providers
         */
        private passive: VoidCaptcha_PassiveProvider[];

        /**
         * Create a new VoidCaptcha instance
         * @param config VoidCaptcha configuration.
         */
        public constructor(config: VoidCaptcha_RequiredConfig) {
            let active;

            if (config.providers instanceof Array) {
                active = [...config.providers].filter(provider => !provider.passive);
            }
            if (active.length === 0) {
                throw new Error('VoidCaptcha requires at least one active provider.');
            }

            this.config = Object.assign({}, VoidCaptchaInstance.config, config);
            this.events = {};
            this.active = active;
            this.passive = [...config.providers].filter(provider => provider.passive) as VoidCaptcha_PassiveProvider[];
        }

        /**
         * Translate / Localize key
         * @param key 
         * @return The localized / translated string.
         */
        private trans(key: keyof VoidCaptcha_LocaleStrings, locale?: string|string[]): string {
            locale = typeof locale === 'undefined' ? (this.config.locale || 'en') : locale;
            if (locale instanceof Array) {
                let temp: string = key;
                for (let i = 0; i < locale.length; i++) {
                    if ((temp = this.trans(key, locale[i])) !== key) {
                        break;
                    }
                }
                return temp;
            } else {
                return VoidCaptcha['Locales'][locale][key] ?? key;
            }
        }

        /**
         * cURL / fetch the callback API 
         * @param action 
         */
         private async curl(action: 'request' | 'verify', root: HTMLElement) {
            let formData = new FormData;
            formData.set('void[data][width]', '250');
            formData.set('void[data][height]', '300');
            for (let provider of this.config.providers) {
                formData.set('void[providers][]', provider.name);
            }
            formData.set('void[session]', root.dataset.voidCaptcha);

            // Prepare Headers
            let headers = new Headers();
            headers.append('DNT', '1');
            headers.append('X-Requested-With', 'XMLHttpRequest');
            headers.append('Via', 'VoidCaptcha');

            if (this.config.callbackHeaders && typeof this.config.callbackHeaders === 'object') {
                for (const [key, val] of Object.entries(this.config.callbackHeaders)) {
                    headers.append(key, val);
                }
            }

            // Request
            let response = await fetch(this.config.callbackUrl, {
                method: 'POST',
                body: formData,
                headers: headers
            });

            let result = null;
            try {
                result = await response.json();
            } catch(e) {
                this.trigger('error', root);
                return false;
            }
            return result;
        }

        /**
         * Assign VoidCaptcha instance to specific element(s) or selector.
         * @param {mixed} selector
         */
        public assign(selector: VoidCaptcha_Selector) {
            if (typeof selector === 'string') {
                selector = document.querySelectorAll(selector);
            }
            if (selector instanceof HTMLElement) {
                selector = [selector];
            }
            if (!('length' in selector) || selector.length === 0) {
                throw new Error('The passed selector does not match or contain any valid HTML element.');
            }

            // Loop Elements
            [...(selector as HTMLElement[])].map(this.init.bind(this));
        }

        /**
         * Initialize VoidCaptcha Element
         * @param root 
         */
        private init(root: HTMLElement) {
            root.classList.add('void-captcha');
            root.dataset.voidCaptchaState = 'loading';

            // Create Inputs
            let session = document.createElement('INPUT') as HTMLInputElement;
            session.type = 'hidden';
            session.name = (root.dataset.name || 'void') + '[session]';
            session.value = root.dataset.voidCaptcha;
            root.appendChild(session);

            let checksum = document.createElement('INPUT') as HTMLInputElement;
            checksum.type = 'hidden';
            checksum.name = (root.dataset.name || 'void') + '[checksum]';
            checksum.value = '';
            root.appendChild(checksum);

            // Create Field
            let field = document.createElement('DIV');
            field.className = `void-captcha-field`;
            field.innerHTML = `
                <label>${this.trans('verify')}</label>
                <a href="https://voidcaptcha.com" target="_blank">Powered by VoidCaptcha</a>
            `;
            root.appendChild(field);

            // Initialize passive Providers
            for (const provider of this.passive) {
                provider.init({ ...this.config });
            }

            // Initialize active Providers
            for (const provider of this.active) {
                provider.init({ ...this.config });
            }
            
            // Add Event Listener
            root.addEventListener('click', this.onClick.bind(this, root));
            this.trigger('init', root);
            return root;
        }

        /**
         * Handle onClick
         * @param root 
         * @param event 
         */
        private async onClick(root: HTMLElement, event) {
            if (root.dataset.voidCaptchaState === 'completed') {
                return;     // Active VoidCaptcha has been completed
            }
            if (root.dataset.voidCaptchaState === 'success') {
                return;     // Passive VoidCaptcha Test has been passed
            }
            if (root.dataset.voidCaptchaState === 'error') {
                root.dataset.voidCaptchaState = 'loading';
            }

            if (root.dataset.voidCaptchaState === 'loading') {
                root.dataset.voidCaptchaState = 'pending';
                root.querySelector('label').innerText = this.trans('loading');

                // Invalid Response
                let result = await this.curl('request', root);
                if (result === false) {
                    root.dataset.voidCaptchaState = 'error';
                    root.querySelector('label').innerText = this.trans('error');
                    return;
                }

                // Passive Provider
                setTimeout(async () => {
                    if (this.passive.length > 0) {
                        let botScore = { ...score };
                        for (const provider of this.passive) {
                            botScore = await provider.process(botScore);
                        }
                        if (botScore.valid()) {
                            root.dataset.voidCaptchaState = 'success';
                            root.querySelector('label').innerText = this.trans('valid');
                            return;
                        }
                    }
    
                    // Active Provider (Fallback)
                    console.log(result);
                    let provider = this.active[result.provider];
                }, 10);
            }
        }

        /**
         * Request VoidCaptcha Details
         * @param root 
         */
        private request(root: HTMLElement) {

        }


        private opens(root: HTMLElement) {
            if (root.dataset.voidCaptchaState === 'pending') {
                this.render(root);
            }
            root.dataset.voidCaptchaState = 'open';

        }

        private render(root: HTMLElement) {
            root.dataset.voidCaptchaState = 'loading';

        }

        private closes(root: HTMLElement) {
            root.dataset.voidCaptchaState = 'open';

        }






        /**
         * Render Main Popover
         * @returns 
         */
        private renderPopover(root: HTMLElement) {
            let popover = document.createElement('DIV');
            popover.className = `void-captcha-popover`;

            //@todo
            popover.innerHTML = `
                <canvas width="250" height="300" class="void-captcha-puzzle"></canvas>
                
                <div class="void-captcha-actions">
                    <button type="button" data-void="reload">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                        <span>Reload</span>
                    </button>
                    <button type="button" data-void="close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                        <span>Close</span>
                    </button>
                </div>
            `;
            return [popover];
        }

        /**
         * Open Popover
         */
        public async open(root, event) {
            if (root.classList.contains('loading') || root.classList.contains('open')) {
                return;
            }
            root.classList.add('loading');

            // Fetch State
            let canvas = root.querySelector('CANVAS');
            let providers = {};

            // Request
            let formData = new FormData;
            formData.set('void[data][width]', '250');
            formData.set('void[data][height]', '300');
            for (let provider of this.config.providers) {
                providers[provider.name] = provider;
                formData.set('void[providers][]', provider.name);
            }
            formData.set('void[session]', root.dataset.voidCaptcha);

            // AJAX Call
            let result = await fetch(this.config.callbackUrl, {
                method: 'POST',
                body: formData
            }).then(response => response.json());

            const write = function(value: string) {
                let field = root.querySelector('input[type="hidden"][name$="[checksum]"]');
                field.value = value;
            };
            const reload = async () => {
                result = await fetch(this.config.callbackUrl, {
                    method: 'POST',
                    body: formData
                }).then(response => response.json());

                providers[result.provider].draw(canvas, result.response, write);
            };
            providers[result.provider].draw(canvas, result.response, write);

            root.querySelector('button[data-void="reload"]').addEventListener('click', reload);
            root.querySelector('button[data-void="close"]').addEventListener('click', close);

            root.classList.remove('loading');
            root.classList.add('waiting');
            root.classList.add('open');
        }

        /**
         * Close Popover
         */
        public close() {

        }

        /**
         * Front-End Verify a VoidCaptcha
         */
        public verify() {
            
        }

        /**
         * Back-End Validate a VoidCaptcha
         */
        public validate() {

        }

        /**
         * Trigger attached event listeners.
         * @param event 
         * @param root 
         */
        private trigger(event: VoidCaptcha_Events, root: HTMLElement) {
            if(!(event in this.events)) {
                return;
            }

            for (const callback of this.events[event]) {
                callback.call(window, this, root);
            }
        }

        /**
         * Attach an event listener.
         * @param event 
         * @param callback 
         */
        public on(event: VoidCaptcha_Events, callback: (captcha: VoidCaptchaInstance, root: HTMLElement) => void): void {
            if (!(event in this.events)) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        }

        /**
         * Detach an event listener
         * @param event 
         * @param callback 
         */
        public off(event: VoidCaptcha_Events, callback: (captcha: VoidCaptchaInstance, root: HTMLElement) => void): void {
            let index;
            if (event in this.events && (index = this.events[event].indexOf(callback)) >= 0) {
                this.events[event].splice(index, 1);
            }
        }

    })(config);
});

const Locales: { [name: string]: VoidCaptcha_LocaleStrings } = {};
VoidCaptcha['Locales'] = Locales;

const Providers: { [name: string]: VoidCaptcha_BaseProvider } = {};
VoidCaptcha['Providers'] = Providers;

export default VoidCaptcha;
