import { VoidCaptcha_PassiveProvider } from "src/types";

class VoidCaptcha_PowProvider implements VoidCaptcha_PassiveProvider {

    /**
     * Unique Provider Name
     */
    get name() {
        return 'pow';
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

export default VoidCaptcha_PowProvider;
