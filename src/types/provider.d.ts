
export interface VoidCaptcha_ActiveProvider {

    /**
     * Unique Provider Name
     */
    readonly name: string;

    /**
     * Boolean State about provider type
     */
    readonly passive: false;

    /**
     * Initialize Provider
     */
    init(): void;

    /**
     * Draw Provider (for active providers only)
     */
    draw(canvas: HTMLCanvasElement, response: unknown, reload: () => Promise<unknown>, write: (checksum: string) => void): void;

}

export interface VoidCaptcha_PassiveProvider {

    /**
     * Unique Provider Name
     */
    readonly name: string;

    /**
     * Boolean State about provider type
     */
    readonly passive: true;

    /**
     * Initialize Provider
     */
    init(): void;

}

export type VoidCaptcha_Provider = VoidCaptcha_ActiveProvider | VoidCaptcha_PassiveProvider;
