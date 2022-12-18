
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

export interface VoidCaptcha_Request {

    /**
     * Canvas Dimensions - Used for back-end image rendering
     */
    canvas: {
        width: number | string;
        height: number | string;
    },

    /**
     * List of active and passive providers - Used for back-end calculation
     */
    providers: {
        active: string[];
        passive: string[];
    },

    /**
     * Current CAPTCHA session key
     */
    session: string;

}

export type VoidCaptcha_Response = {

    /**
     * HTTP Status Code
     */
    status: number;

    /**
     * Boolean status state
     */
    success: true;

    /**
     * Response Data
     */
    result: {
        session: string;
        providers: { [key: string]: unknown };
    }

} | {
    

    /**
     * HTTP Status Code
     */
    status: number;

    /**
     * Boolean status state
     */
    success: false;

    /**
     * Response Data
     */
    result: {
        session?: string;
        message: string;
        details?: unknown;
    }

}
