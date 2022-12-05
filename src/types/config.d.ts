import { VoidCaptcha_Provider } from "./provider";

export interface VoidCaptcha_Config {

    /**
     * Available Providers to be used.
     * @type {VoidCaptcha_Provider[]}
     * @default null
     */
    providers: VoidCaptcha_Provider[];

    /**
     * The default bot score for each user.
     * @type {number}
     * @default 20
     */
    botScore: number;

    /**
     * Required bot-score to skip active provider.
     * @type {number}
     * @default 5
     */
    requiredBotScore: number;

    /**
     * The AJAX URL for the VoidCaptcha.
     * @type {string}
     * @default null
     */
    url: string;

}
