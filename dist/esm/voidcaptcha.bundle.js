/*!
|  @voidcaptcha/core - VoidCaptcha is a free and open source multi-solution CAPTCHA library to keep your forms bot-free.
|  @file       dist/js/voidcaptcha.bundle.js
|  @version    0.1.0
|  @author     Sam <sam@rat.md> (https://rat.md)
|  
|  @website    https:/void-captcha.com/
|  @license    MIT License
|  @copyright  Copyright © 2021 - 2022 rat.md <info@rat.md>
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
    ({
        current: config.botScore || 20,
        required: config.requiredBotScore || 5,
        increase(num) {
            this.current += num;
        },
        decrease(num) {
            this.current -= num;
        },
        valid() {
            return this.current <= this.required;
        }
    });
    return new (class VoidCaptcha {
        static ready() {
            let event = new CustomEvent('VoidCaptcha::loaded');
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', window.dispatchEvent.bind(null, event));
            }
            else {
                setTimeout(window.dispatchEvent.bind(null, event), 10);
            }
        }
        static get config() {
            return {
                providers: [],
                botScore: 20,
                requiredBotScore: 5,
                url: null
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
            this.config = Object.assign({}, VoidCaptcha.config, config);
            this.active = active;
        }
        create(selector) {
            if (typeof selector === 'string') {
                selector = document.querySelectorAll(selector);
            }
            if (selector instanceof HTMLElement) {
                selector = [selector];
            }
            if (!('length' in selector) || selector.length === 0) {
                throw new Error('The passed selector does not match or contain any valid element.');
            }
            [...selector].map(root => {
                root.classList.add('void-captcha');
                root.classList.add('pending');
                root.append(...this.renderHidden(root));
                root.append(...this.renderField(root));
                root.append(...this.renderPopover(root));
                root.addEventListener('click', this.open.bind(this, root));
            });
        }
        renderHidden(root) {
            let session = document.createElement('INPUT');
            session.type = 'hidden';
            session.name = (root.dataset.name || 'void') + '[session]';
            session.value = root.dataset.voidCaptcha;
            let checksum = document.createElement('INPUT');
            checksum.type = 'hidden';
            checksum.name = (root.dataset.name || 'void') + '[checksum]';
            checksum.value = '';
            return [session, checksum];
        }
        renderField(root) {
            let field = document.createElement('DIV');
            field.className = `void-captcha-field`;
            field.innerHTML = `
                <label><span class="status-pending"></span> Click to Verify</label>
                <a href="https://voidcapture.com" target="_blank">Powered by VoidCapture</a>
            `;
            return [field];
        }
        renderPopover(root) {
            let popover = document.createElement('DIV');
            popover.className = `void-captcha-popover`;
            popover.innerHTML = `<canvas width="200" height="200" class="void-captcha-puzzle"></canvas>`;
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
                formData.set('void[data][width]', '200');
                formData.set('void[data][height]', '200');
                for (let provider of this.config.providers) {
                    providers[provider.name] = provider;
                    formData.set('void[providers][]', provider.name);
                }
                formData.set('void[session]', root.dataset.voidCaptcha);
                let result = yield fetch(this.config.url, {
                    method: 'POST',
                    body: formData
                }).then(response => response.json());
                const write = function (value) {
                    let field = root.querySelector('input[type="hidden"][name$="[checksum]"]');
                    field.value = value;
                };
                const reload = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        formData.delete('void[providers][]');
                        formData.set('void[providers][]', result.provider);
                        return yield fetch(this.config.url, {
                            method: 'POST',
                            body: formData
                        }).then(response => response.json());
                    });
                };
                providers[result.provider].draw(canvas, result.response, reload, write);
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
    })(config);
});

class VoidCaptcha_DetectProvider {
    get name() {
        return 'detect';
    }
    get passive() {
        return true;
    }
    init() {
    }
}

class VoidCaptcha_PowProvider {
    get name() {
        return 'pow';
    }
    get passive() {
        return true;
    }
    init() {
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
    draw(canvas, response, reload, write) {
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
        this.placeholder = 'Select  all similar images';
    }
    get name() {
        return 'similar-image';
    }
    get passive() {
        return false;
    }
    init() {
    }
    draw(canvas, response) {
        let label = canvas.parentElement.previousElementSibling.querySelector('label');
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;
    }
}

class VoidCaptcha_SlidePuzzleProvider {
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
    draw(canvas, response, reload, write) {
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
    draw(canvas, response, reload, write) {
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

export { VoidCaptcha, VoidCaptcha_DetectProvider, VoidCaptcha_PowProvider, VoidCaptcha_PuzzleProvider, VoidCaptcha_SimilarImageProvider, VoidCaptcha_SlidePuzzleProvider, VoidCaptcha_TextProvider };
//# sourceMappingURL=voidcaptcha.bundle.js.map
