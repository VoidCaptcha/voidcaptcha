
import VoidCaptcha from './voidcaptcha';
import {
    VoidCaptcha_DetectProvider,
    VoidCaptcha_ProofOfWorkProvider,
    VoidCaptcha_PuzzleProvider,
    VoidCaptcha_SimilarImageProvider,
    VoidCaptcha_SlidePuzzleProvider,
    VoidCaptcha_TextProvider
} from './providers';


VoidCaptcha['Providers'] = {
    Detect: VoidCaptcha_DetectProvider,
    ProofOfWork: VoidCaptcha_ProofOfWorkProvider,
    Puzzle: VoidCaptcha_PuzzleProvider,
    SimilarImage: VoidCaptcha_SimilarImageProvider,
    SlidePuzzle: VoidCaptcha_SlidePuzzleProvider,
    Text: VoidCaptcha_TextProvider
};

export default VoidCaptcha;
