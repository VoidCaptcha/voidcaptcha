
export type VoidCaptcha_Selector = string | HTMLElement | HTMLElement[] | NodeList | HTMLCollection;

export type VoidCaptcha_Events = 'init' | 'puzzle' | 'valid' | 'invalid' | 'error';

export interface VoidCaptcha_BotScore {

    readonly current: number;
    readonly required: number;

    increase(num: number): void;
    
    decrease(num: number): void;

    valid(): boolean;
    
}
