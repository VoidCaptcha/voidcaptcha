import { VoidCaptcha_ActiveProvider } from "src/types";

class VoidCaptcha_SimilarImageProvider implements VoidCaptcha_ActiveProvider {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private placeholder: string = 'Select  all similar images';

    /**
     * Unique Provider Name
     */
    get name() {
        return 'similar-image';
    }

    /**
     * Boolean State about provider type
     */
    get passive(): false {
        return false;
    }

    /**
     * Initialize Provider
     */
    init(): void
    {

    }
 
    /**
     * Draw Provider (for active providers only)
     */
    draw(canvas: HTMLCanvasElement, response: unknown): void
    {

        let label = canvas.parentElement.previousElementSibling.querySelector('label') as HTMLLabelElement;
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;

    }

}

export default VoidCaptcha_SimilarImageProvider;
