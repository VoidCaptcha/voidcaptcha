import { 
    VoidCaptcha_BotScore, 
    VoidCaptcha_Response 
} from "./common";
import { VoidCaptcha_Config } from "./config";

export interface VoidCaptcha_BaseProvider {
    
    /**
     * Unique Provider Name.
     */
    readonly name: string;

    /**
     * Boolean State about the Provider type.
     */
    readonly passive: boolean;

    /**
     * Initialize Provider
     * @param config Main VoidCaptcha configuration.
     */
    init(config: VoidCaptcha_Config): void;

}

export interface VoidCaptcha_ActiveProvider extends VoidCaptcha_BaseProvider {

    /**
     * Boolean State about the Provider type.
     */
    readonly passive: false;

    /**
     * Draw Provider
     * @param canvas The main canvas element, where the puzzle must be drawn.
     * @param response The main server response containing the puzzle details.
     * @param write A callback function to write the puzzle solution.
     */
    draw(canvas: HTMLCanvasElement, response: VoidCaptcha_Response, write: (checksum: string) => void): void;

}

export interface VoidCaptcha_PassiveProvider extends VoidCaptcha_BaseProvider {

    /**
     * Boolean State about the Provider type.
     */
    readonly passive: true;

    /**
     * Process Provider
     * @param score The BotScore object handler.
     */
    process(score: VoidCaptcha_BotScore): Promise<VoidCaptcha_BotScore>;

}

export type VoidCaptcha_Provider = VoidCaptcha_ActiveProvider | VoidCaptcha_PassiveProvider;
