
import VoidCaptcha from './voidcaptcha';
import {
    VoidCaptcha_DetectProvider,
    VoidCaptcha_PowProvider,
    VoidCaptcha_PuzzleProvider,
    VoidCaptcha_SimilarImageProvider,
    VoidCaptcha_SlidePuzzleProvider,
    VoidCaptcha_TextProvider
} from './providers';


VoidCaptcha['Providers'] = {
    VoidCaptcha_DetectProvider,
    VoidCaptcha_PowProvider,
    VoidCaptcha_PuzzleProvider,
    VoidCaptcha_SimilarImageProvider,
    VoidCaptcha_SlidePuzzleProvider,
    VoidCaptcha_TextProvider
};

export default VoidCaptcha;
