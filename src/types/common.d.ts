
export type VoidCaptcha_Selector = string | HTMLElement | HTMLElement[] | NodeList | HTMLCollection;

export type VoidCaptcha_Events = 'init' | 'puzzle' | 'valid' | 'invalid' | 'error';

export interface VoidCaptcha_BotScore {

    /**
     * Current Score Value
     */
    readonly current: number;

    /**
     * Required Score Value
     */
    readonly required: number;

    /**
     * Increase current score by num
     * @param num 
     */
    increase(num: number): void;
    
    /**
     * Decrease current score by num
     * @param num 
     */
    decrease(num: number): void;

    /**
     * Check if user us human / score is within valid range
     */
    valid(): boolean;
    
}

export interface VoidCaptcha_LocaleStrings {

    /**
     * Captcha error occured
     * @default en An error occurred, please try again
     */
    error: string;
    
    /**
     * Verification failed, user must click again
     * @default en Verification failed, please try again
     */
    invalid: string;

    /**
     * Solving passive provider / loading Captcha Puzzle from Back-End
     * @default en Evaluating, please wait...
     */
    loading: string;
    
    /**
     * Captcha Puzzle must been solved
     * @default en Please solve the puzzle below
     */
    puzzle: string;
    
    /**
     * Captcha has been solved
     * @default end You're human
     */
    valid: string;
    
    /**
     * Initial message
     * @default en Click to verify you're human
     */
    verify: string;

}
