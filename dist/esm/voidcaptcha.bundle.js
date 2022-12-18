/*!
*  @voidcaptcha/core - VoidCaptcha is a free and open source multi-solution CAPTCHA library to keep your forms bot-free.
*  @file       dist/js/voidcaptcha.bundle.js
*  @version    0.1.0
*  @author     Sam <sam@rat.md> (https://rat.md)
*  
*  @website    https:/void-captcha.com/
*  @license    MIT License
*  @copyright  Copyright © 2021 - 2022 rat.md <info@rat.md>
*/
"use strict";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const VoidCaptcha = (function (config) {
    const score = {
        current: config.botScore || 20,
        required: config.botScoreRequired || 5,
        increase(num) {
            this.current += num;
        },
        decrease(num) {
            this.current -= num;
        },
        valid() {
            return this.current <= this.required;
        }
    };
    return new (class VoidCaptchaInstance {
        static get config() {
            let locale = [...navigator.languages] || ['en'];
            return {
                botScore: 20,
                botScoreRequired: 5,
                callbackHeaders: null,
                callbackUrl: null,
                callToValidate: false,
                locale,
                providers: null
            };
        }
        constructor(config) {
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
            this.passive = [...config.providers].filter(provider => provider.passive);
        }
        trans(key, locale) {
            var _a;
            locale = typeof locale === 'undefined' ? (this.config.locale || 'en') : locale;
            if (locale instanceof Array) {
                let temp = key;
                for (let i = 0; i < locale.length; i++) {
                    if ((temp = this.trans(key, locale[i])) !== key) {
                        break;
                    }
                }
                return temp;
            }
            else {
                return (_a = VoidCaptcha['Locales'][locale][key]) !== null && _a !== void 0 ? _a : key;
            }
        }
        curl(action, root) {
            return __awaiter(this, void 0, void 0, function* () {
                let formData = new FormData;
                formData.set('void[data][width]', '250');
                formData.set('void[data][height]', '300');
                for (let provider of this.config.providers) {
                    formData.set('void[providers][]', provider.name);
                }
                formData.set('void[session]', root.dataset.voidCaptcha);
                let headers = new Headers();
                headers.append('DNT', '1');
                headers.append('X-Requested-With', 'XMLHttpRequest');
                headers.append('Via', 'VoidCaptcha');
                if (this.config.callbackHeaders && typeof this.config.callbackHeaders === 'object') {
                    for (const [key, val] of Object.entries(this.config.callbackHeaders)) {
                        headers.append(key, val);
                    }
                }
                let response = yield fetch(this.config.callbackUrl, {
                    method: 'POST',
                    body: formData,
                    headers: headers
                });
                let result = null;
                try {
                    result = yield response.json();
                }
                catch (e) {
                    this.trigger('error', root);
                    return false;
                }
                return result;
            });
        }
        assign(selector) {
            if (typeof selector === 'string') {
                selector = document.querySelectorAll(selector);
            }
            if (selector instanceof HTMLElement) {
                selector = [selector];
            }
            if (!('length' in selector) || selector.length === 0) {
                throw new Error('The passed selector does not match or contain any valid HTML element.');
            }
            [...selector].map(this.init.bind(this));
        }
        init(root) {
            root.classList.add('void-captcha');
            root.dataset.voidCaptchaState = 'loading';
            let session = document.createElement('INPUT');
            session.type = 'hidden';
            session.name = (root.dataset.name || 'void') + '[session]';
            session.value = root.dataset.voidCaptcha;
            root.appendChild(session);
            let checksum = document.createElement('INPUT');
            checksum.type = 'hidden';
            checksum.name = (root.dataset.name || 'void') + '[checksum]';
            checksum.value = '';
            root.appendChild(checksum);
            let field = document.createElement('DIV');
            field.className = `void-captcha-field`;
            field.innerHTML = `
                <label>${this.trans('verify')}</label>
                <a href="https://voidcaptcha.com" target="_blank">Powered by VoidCaptcha</a>
            `;
            root.appendChild(field);
            for (const provider of this.passive) {
                provider.init(Object.assign({}, this.config));
            }
            for (const provider of this.active) {
                provider.init(Object.assign({}, this.config));
            }
            root.addEventListener('click', this.onClick.bind(this, root));
            this.trigger('init', root);
            return root;
        }
        onClick(root, event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (root.dataset.voidCaptchaState === 'completed') {
                    return;
                }
                if (root.dataset.voidCaptchaState === 'success') {
                    return;
                }
                if (root.dataset.voidCaptchaState === 'error') {
                    root.dataset.voidCaptchaState = 'loading';
                }
                if (root.dataset.voidCaptchaState === 'loading') {
                    root.dataset.voidCaptchaState = 'pending';
                    root.querySelector('label').innerText = this.trans('loading');
                    let result = yield this.curl('request', root);
                    if (result === false) {
                        root.dataset.voidCaptchaState = 'error';
                        root.querySelector('label').innerText = this.trans('error');
                        return;
                    }
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        if (this.passive.length > 0) {
                            let botScore = Object.assign({}, score);
                            for (const provider of this.passive) {
                                botScore = yield provider.process(botScore);
                            }
                            if (botScore.valid()) {
                                root.dataset.voidCaptchaState = 'success';
                                root.querySelector('label').innerText = this.trans('valid');
                                return;
                            }
                        }
                        console.log(result);
                        this.active[result.provider];
                    }), 10);
                }
            });
        }
        request(root) {
        }
        opens(root) {
            if (root.dataset.voidCaptchaState === 'pending') {
                this.render(root);
            }
            root.dataset.voidCaptchaState = 'open';
        }
        render(root) {
            root.dataset.voidCaptchaState = 'loading';
        }
        closes(root) {
            root.dataset.voidCaptchaState = 'open';
        }
        renderPopover(root) {
            let popover = document.createElement('DIV');
            popover.className = `void-captcha-popover`;
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
        open(root, event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (root.classList.contains('loading') || root.classList.contains('open')) {
                    return;
                }
                root.classList.add('loading');
                let canvas = root.querySelector('CANVAS');
                let providers = {};
                let formData = new FormData;
                formData.set('void[data][width]', '250');
                formData.set('void[data][height]', '300');
                for (let provider of this.config.providers) {
                    providers[provider.name] = provider;
                    formData.set('void[providers][]', provider.name);
                }
                formData.set('void[session]', root.dataset.voidCaptcha);
                let result = yield fetch(this.config.callbackUrl, {
                    method: 'POST',
                    body: formData
                }).then(response => response.json());
                const write = function (value) {
                    let field = root.querySelector('input[type="hidden"][name$="[checksum]"]');
                    field.value = value;
                };
                const reload = () => __awaiter(this, void 0, void 0, function* () {
                    result = yield fetch(this.config.callbackUrl, {
                        method: 'POST',
                        body: formData
                    }).then(response => response.json());
                    providers[result.provider].draw(canvas, result.response, write);
                });
                providers[result.provider].draw(canvas, result.response, write);
                root.querySelector('button[data-void="reload"]').addEventListener('click', reload);
                root.querySelector('button[data-void="close"]').addEventListener('click', close);
                root.classList.remove('loading');
                root.classList.add('waiting');
                root.classList.add('open');
            });
        }
        close() {
        }
        verify() {
        }
        validate() {
        }
        trigger(event, root) {
            if (!(event in this.events)) {
                return;
            }
            for (const callback of this.events[event]) {
                callback.call(window, this, root);
            }
        }
        on(event, callback) {
            if (!(event in this.events)) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        }
        off(event, callback) {
            let index;
            if (event in this.events && (index = this.events[event].indexOf(callback)) >= 0) {
                this.events[event].splice(index, 1);
            }
        }
    })(config);
});
const Locales = {};
VoidCaptcha['Locales'] = Locales;
const Providers = {};
VoidCaptcha['Providers'] = Providers;

var de = {
    error: 'Ein Fehler ist aufgetreten, versuche es erneut',
    invalid: 'Verifizierung fehlgeschlagen, versuche es erneut',
    loading: 'Evaluierung, bitte warte...',
    puzzle: 'Bitte löse das Puzzle unterhalb',
    valid: 'Du bist ein Mensch',
    verify: 'Klicke um zu prüfen ob du ein Mensch bist'
};

var en = {
    error: 'An error occurred, please try again',
    invalid: 'Verification failed, please try again',
    loading: 'Evaluating, please wait...',
    puzzle: 'Please solve the puzzle below',
    valid: 'You\'re human',
    verify: 'Click to verify you\'re human',
};

class VoidCaptcha_DetectProvider {
    get name() {
        return 'detect';
    }
    get passive() {
        return true;
    }
    get userAgentRegex() {
        return {
            'high': [
                'always(.*)online',
                'archiver',
                'browsershot',
                'crawler',
                'diagnostic',
                '(down|up)time',
                'indexer',
                'monitoring',
                'scanner',
                'sp(i|y)der',
                'aboundex',
                'addthis',
                'alexa',
                'ahref',
                'arachni',
                'archive\.org',
                'butterfly',
                'cloudflare',
                'coccoc',
                'curios',
                'domain(.+)',
                'duckduck',
                'ezoom',
                'let\'?s(.*)encrypt',
                'httpmon',
                'outbrain',
                'pinterest',
                'postm(a|e)n',
                'quora',
                'yandex',
            ].join('|'),
            'normal': [
                'archive',
                'ask(.+)',
                'audit',
                'backlink',
                'batch',
                '(.+)bot',
                'checker',
                'collect',
                'diagnose',
                'extractor',
                'fetch',
                'generator',
                'grab',
                'headless',
                'http',
                'hunter',
                'lookup',
                'index',
                'insight',
                'inspector',
                'monitor',
                'optimize',
                'probe',
                'provider',
                'proxy',
                'review',
                'riddle',
                'scan',
                'schedule',
                'scrap',
                'screenshot',
                'search',
                'seeker',
                'service',
                'share',
                'sucker',
                'synthetics',
                'testing',
                'transcoder',
                'validator',
                'veri(f|t)y',
                'amazon',
                'apache',
                'facebook',
                'feedburner',
                'feedly',
                'feedpin',
                'gmail',
                'hubspot',
                'kaspersky',
                'linked',
                'mastodon',
                'php',
                'python',
                'reddit',
                'shopify',
                'torrent',
                'twitter',
                'W3C\_',
                'wordpress',
            ].join('|'),
            'low': [
                '\.com',
                'agent',
                'blog',
                'bin',
                'bot',
                'cache',
                'data',
                'e?mail',
                'engine',
                'explorer',
                'favicon',
                'feed',
                'filter',
                'guide',
                'improve',
                'modified',
                'online',
                'parse',
                'preview',
                'reader',
                'rss',
                'seo',
                'server',
                'shop',
                'site',
                'sql',
                'scrap',
                'ssl',
                'stats?(istic)?',
                'wiki',
                'google'
            ].join('|')
        };
    }
    constructor() {
        this.rules = {
            userAgent: {
                malicious: 50,
                suspicious: 25,
                strange: 10,
                empty: 10,
                valid: -5
            },
        };
    }
    init() {
        this.detectUserAgent();
        this.detectBrowserAndDevice();
        {
            this.startUserObserver();
        }
    }
    detectUserAgent() {
        let userAgent = navigator.userAgent.trim();
        if (userAgent.length) ;
        return 1;
    }
    detectBrowserAndDevice() {
        /headless/.test(navigator.userAgent) ? 40 : 0;
        if ((window.screen['width'] || 0) === 800 && (window.screen['height'] || 0) === 600) {
            if (window.screen.orientation['type'].indexOf('portrait') === 0 && window.outerWidth == 800 && window.outerHeight === 600) ;
        }
        if ((navigator.plugins || []).length === 0) ;
        return 1;
    }
    startUserObserver() {
    }
    process(score) {
        return new Promise((resolve, reject) => {
            resolve(score);
        });
    }
}

class VoidCaptcha_ProofOfWorkProvider {
    get name() {
        return 'proof-of-work';
    }
    get passive() {
        return true;
    }
    constructor(difficulty = 4, timeout = 20000) {
        this.block = null;
        this.difficulty = difficulty;
        this.timeout = timeout;
    }
    init(config) {
        this.block = 'data';
        this.difficulty = 4;
        this.timeout = 20 * 1000;
    }
    process(score) {
        return new Promise((resolve, reject) => {
            let webWorkerURL = URL.createObjectURL(new Blob([
                '(', this.webWorker(), ')()'
            ], { type: 'application/javascript' }));
            let worker = new Worker(webWorkerURL);
            worker.onmessage = (event) => {
                let hash = event.data.hash;
                let difficulty = event.data.difficulty;
                let startsWith = hash.substr(0, difficulty) === Array(difficulty + 1).join('0');
                let lastNumber = parseInt(hash.substr(-1));
                if (startsWith && !isNaN(lastNumber)) {
                    score.decrease(20);
                }
                worker.terminate();
                resolve(score);
            };
            worker.onerror = (event) => {
                worker.terminate();
                resolve(score);
            };
            worker.postMessage({
                block: this.block,
                difficulty: this.difficulty,
                timeout: this.timeout
            });
            URL.revokeObjectURL(webWorkerURL);
        });
    }
    webWorker() {
        return function () {
            addEventListener('message', (event) => {
                let block = event.data.block;
                let difficulty = event.data.difficulty;
                let timeoutTime = event.data.timeout;
                let hash;
                let nonce = 0;
                let encoder = new TextEncoder;
                let timeout = false;
                let timeStart = Date.now();
                function check(value) {
                    hash = Array.from(new Uint8Array(value)).map(c => c.toString(16).padStart(2, '0')).join('');
                    let startsWith = hash.substr(0, difficulty) === Array(difficulty + 1).join('0');
                    let lastNumber = parseInt(hash.substr(-1));
                    if (startsWith && !isNaN(lastNumber)) {
                        report();
                    }
                    else {
                        calculate();
                    }
                }
                function report() {
                    postMessage({
                        data: event.data,
                        block: block,
                        difficulty: difficulty,
                        hash: hash,
                        time: Date.now() - timeStart
                    });
                }
                function calculate() {
                    if (timeout) {
                        return report();
                    }
                    let buffer = encoder.encode(hash + (nonce++));
                    crypto.subtle.digest('SHA-512', buffer.buffer).then(check, report);
                }
                setTimeout(() => { timeout = true; }, timeoutTime);
                calculate();
            });
        }.toString();
    }
}

class VoidCaptcha_PuzzleProvider {
    constructor() {
        this.placeholder = 'Slide until the piece fits';
    }
    get name() {
        return 'puzzle';
    }
    get passive() {
        return false;
    }
    init() {
    }
    draw(canvas, response, write) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.save();
        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = response['source'];
        const piece = new Image();
        piece.onload = (event) => {
            this.ctx.drawImage(piece, 0, 30);
        };
        piece.src = response['piece'];
        let label = canvas.parentElement.previousElementSibling.querySelector('label');
        label.contentEditable = 'true';
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;
        let slider = document.createElement('INPUT');
        slider.type = 'range';
        slider.value = '0';
        slider.min = '0';
        slider.max = '100';
        slider.addEventListener('input', (event) => {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.drawImage(image, 0, 0);
            this.ctx.drawImage(piece, (canvas.width - piece.width) / 100 * parseInt(slider.value), 30);
            write(((canvas.width - piece.width) / 100 * parseInt(slider.value)).toString());
        });
        canvas.parentElement.appendChild(slider);
    }
}

class VoidCaptcha_PuzzleSlideProvider {
    constructor() {
        this.placeholder = 'Slide until the piece fits';
    }
    get name() {
        return 'slide-puzzle';
    }
    get passive() {
        return false;
    }
    init() {
    }
    draw(canvas, response, write) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.save();
        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = response['source'];
        const piece = new Image();
        piece.onload = (event) => {
            this.ctx.drawImage(piece, 0, 30);
        };
        piece.src = response['piece'];
        let label = canvas.parentElement.previousElementSibling.querySelector('label');
        label.contentEditable = 'true';
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;
        let slider = document.createElement('INPUT');
        slider.type = 'range';
        slider.value = '0';
        slider.min = '0';
        slider.max = '100';
        slider.addEventListener('input', (event) => {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.drawImage(image, 0, 0);
            this.ctx.drawImage(piece, (canvas.width - piece.width) / 100 * parseInt(slider.value), 30);
            write(((canvas.width - piece.width) / 100 * parseInt(slider.value)).toString());
        });
        canvas.parentElement.appendChild(slider);
    }
}

class VoidCaptcha_SimilarImageProvider {
    constructor() {
        this.placeholder = 'Select all similar images';
    }
    get name() {
        return 'similar-image';
    }
    get passive() {
        return false;
    }
    init() {
    }
    draw(canvas, response, write) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = typeof response === 'string' ? response : '';
        let label = canvas.parentElement.previousElementSibling.querySelector('label');
        label.contentEditable = 'true';
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;
        label.focus();
        label.addEventListener('keyup', (event) => {
            let value = label.innerText.trim();
            if (value.length > 0) {
                label.dataset.placeholder = '';
            }
            else {
                label.dataset.placeholder = this.placeholder;
            }
            write(value);
        });
    }
}

class VoidCaptcha_TextProvider {
    constructor() {
        this.placeholder = 'Enter CAPTCHA Code here';
    }
    get name() {
        return 'text';
    }
    get passive() {
        return false;
    }
    init() {
    }
    draw(canvas, response, write) {
        if (typeof this.ctx !== 'undefined') {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        }
        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = typeof response === 'string' ? response : '';
        let label = canvas.parentElement.previousElementSibling.querySelector('label');
        label.contentEditable = 'true';
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;
        label.focus();
        label.addEventListener('keyup', (event) => {
            let value = label.innerText.trim();
            write(value);
        });
    }
}

export { VoidCaptcha_DetectProvider as Detect, VoidCaptcha_ProofOfWorkProvider as ProofOfWork, VoidCaptcha_PuzzleProvider as Puzzle, VoidCaptcha_PuzzleSlideProvider as PuzzleSlide, VoidCaptcha_SimilarImageProvider as SimilarImage, VoidCaptcha_TextProvider as Text, VoidCaptcha, de, en };
//# sourceMappingURL=voidcaptcha.bundle.js.map
