import '../scss/index.scss';

import type { 
    VoidCaptcha_ActiveProvider,
    VoidCaptcha_Config, 
    VoidCaptcha_Selector
} from "../types";

type VoidCaptcha_RequiredConfig = {providers: VoidCaptcha_Config['providers'], url: VoidCaptcha_Config['url']} & Partial<VoidCaptcha_Config>;

const VoidCaptcha = (function(config: VoidCaptcha_RequiredConfig) {
    const score = {
        current: config.botScore || 20,
        required: config.requiredBotScore || 5,

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

    return new (class VoidCaptcha {

        /**
         * Trigger Event when loaded
         */
        public static ready() {
            let event = new CustomEvent('VoidCaptcha::loaded');

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', window.dispatchEvent.bind(null, event));
            } else {
                setTimeout(window.dispatchEvent.bind(null, event), 10);
            }
        }

        /**
         * Default Configuration
         */
        static get config(): VoidCaptcha_Config {
            return {
                providers: [],
                botScore: 20,
                requiredBotScore: 5,
                url: null
            }
        }

        /**
         * Instance Configuration
         */
        private config: VoidCaptcha_Config;

        /**
         * Active Providers
         */
        private active: VoidCaptcha_ActiveProvider[];

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

            this.config = Object.assign({}, VoidCaptcha.config, config);
            this.active = active;
        }

        /**
         * Create a new VoidCaptcha
         */
        public create(selector: VoidCaptcha_Selector) {
            if (typeof selector === 'string') {
                selector = document.querySelectorAll(selector);
            }
            if (selector instanceof HTMLElement) {
                selector = [selector];
            }

            if (!('length' in selector) || selector.length === 0) {
                throw new Error('The passed selector does not match or contain any valid element.');
            }

            [...(selector as HTMLElement[])].map(root => {
                root.classList.add('void-captcha');
                root.classList.add('pending');
                root.append(...this.renderHidden(root));
                root.append(...this.renderField(root));
                root.append(...this.renderPopover(root));
                root.addEventListener('click', this.open.bind(this, root));
            });
        }

        /**
         * Render Hidden Inputs
         * @returns 
         */
        private renderHidden(root: HTMLElement): HTMLElement[] {
            let session = document.createElement('INPUT') as HTMLInputElement;
            session.type = 'hidden';
            session.name = (root.dataset.name || 'void') + '[session]';
            session.value = root.dataset.voidCaptcha;

            let checksum = document.createElement('INPUT') as HTMLInputElement;
            checksum.type = 'hidden';
            checksum.name = (root.dataset.name || 'void') + '[checksum]';
            checksum.value = '';

            return [session, checksum];
        }

        /**
         * Render Form Control
         * @returns 
         */
        private renderField(root: HTMLElement) {
            let field = document.createElement('DIV');
            field.className = `void-captcha-field`;
            field.innerHTML = `
                <label><span class="status-pending"></span> Click to Verify</label>
                <a href="https://voidcapture.com" target="_blank">Powered by VoidCapture</a>
            `;
            return [field];
        }

        /**
         * Render Main Popover
         * @returns 
         */
        private renderPopover(root: HTMLElement) {
            let popover = document.createElement('DIV');
            popover.className = `void-captcha-popover`;

            //@todo
            popover.innerHTML = `<canvas width="200" height="200" class="void-captcha-puzzle"></canvas>`;
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
            formData.set('void[data][width]', '200');
            formData.set('void[data][height]', '200');
            for (let provider of this.config.providers) {
                providers[provider.name] = provider;
                formData.set('void[providers][]', provider.name);
            }
            formData.set('void[session]', root.dataset.voidCaptcha);

            // AJAX Call
            let result = await fetch(this.config.url, {
                method: 'POST',
                body: formData
            }).then(response => response.json());

            const write = function(value: string) {
                let field = root.querySelector('input[type="hidden"][name$="[checksum]"]');
                field.value = value;
            };
            const reload = async function() {
                formData.delete('void[providers][]');
                formData.set('void[providers][]', result.provider);

                return await fetch(this.config.url, {
                    method: 'POST',
                    body: formData
                }).then(response => response.json());
            };
            providers[result.provider].draw(canvas, result.response, reload, write);

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

    })(config);
})

export default VoidCaptcha;
