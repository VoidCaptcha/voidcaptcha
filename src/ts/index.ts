
import VoidCaptcha from './voidcaptcha';
import {
    VoidCaptcha_DetectProvider,
    VoidCaptcha_ImageProvider,
    VoidCaptcha_PowProvider,
    VoidCaptcha_TextProvider,
    VoidCaptcha_SliderProvider
} from './providers';


VoidCaptcha['Providers'] = {
    Detect: VoidCaptcha_DetectProvider,
    Image: VoidCaptcha_ImageProvider,
    Pow: VoidCaptcha_PowProvider,
    Text: VoidCaptcha_TextProvider,
    Slider: VoidCaptcha_SliderProvider
};

export default VoidCaptcha;
