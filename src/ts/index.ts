
import VoidCaptcha from './voidcaptcha';

import LocaleDE from './locales/de';
import LocaleEN from './locales/en';

import Detect from './providers/detect';
import ProofOfWork from './providers/proof-of-work';
import Puzzle from './providers/puzzle';
import PuzzleSlide from './providers/puzzle-slide';
import SimilarImage from './providers/similar-image';
import Text from './providers/text';

// Append Locales
VoidCaptcha['Locales'] = {
    de: LocaleDE,
    en: LocaleEN,
};

// Append Providers
VoidCaptcha['Providers'] = {
    Detect,
    ProofOfWork,
    Puzzle,
    PuzzleSlide,
    SimilarImage,
    Text
};

// Export Module
export default VoidCaptcha;
