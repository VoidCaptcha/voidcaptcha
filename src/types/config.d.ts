import { VoidCaptcha_Provider } from "./provider";

export interface VoidCaptcha_Config {

    /**
     * Default bot score for each request.
     * @type {number}
     * @default {number} 20
     */
    botScore: number;

    /**
     * Required bot score to skip the active provider.
     * @type {number}
     * @default {number} 5
     */
    botScoreRequired: number;

    /**
     * Additional headers to send with the callback request.
     * @type {{[key: string]: string}}
     * @default {null}
     */
    callbackHeaders: { [key: string]: string };

    /**
     * Callback API URL for VoidCaptcha
     * @type {string}
     * @default {null}
     */
    callbackUrl: string;

    /**
     * Validate CAPTCHA via API Request
     * @type {boolean}
     * @default {boolean} false
     */
    callToValidate: boolean;

    /**
     * Force using a specific locale or list of locales, pass null to rely on browser settings
     * @type {null|string|string[]}
     * @default {null}
     */
    locale: null|string|string[];

    /**
     * Available Providers to be used for this CAPTCHA instance
     * @type {VoidCaptcha_Provider[]}
     * @default {null}
     */
    providers: VoidCaptcha_Provider[];

}
