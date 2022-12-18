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
     * Available Providers to be used for this CAPTCHA instance
     * @type {VoidCaptcha_Provider[]}
     * @default {null}
     */
    providers: VoidCaptcha_Provider[];

    /**
     * Status Message - An error occurred
     * @type {string}
     * @default {string} "An error occurred, please try again"
     */
    statusError: string;
    
    /**
     * Status Message - Invalid Puzzle
     * @type {string}
     * @default {string} "Verification failed, please try again"
     */
    statusInvalid: string;

    /**
     * Status Message - An error occurred
     * @type {string}
     * @default {string} "Evaluating, please wait..."
     */
    statusLoading: string;
    
    /**
     * Status Message - Puzzle
     * @type {string}
     * @default {string} "Please solve the puzzle below"
     */
    statusPuzzle: string;
    
    /**
     * Status Message - Valid Puzzle
     * @type {string}
     * @default {string} "You're human"
     */
    statusValid: string;
    
    /**
     * Status Message - Initial message
     * @type {string}
     * @default {string} "Click to verify you\'re human"
     */
    statusVerify: string;

}
