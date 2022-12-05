import { VoidCaptcha_PassiveProvider } from "src/types";

class VoidCaptcha_DetectProvider implements VoidCaptcha_PassiveProvider {

    /**
     * Unique Provider Name
     */
    get name() {
        return 'detect';
    }

    /**
     * Boolean State about provider type
     */
    get passive(): true {
        return true;
    }

    /**
     * Initialize Provider
     */
    init(): void
    {

    }

}

export default VoidCaptcha_DetectProvider;
