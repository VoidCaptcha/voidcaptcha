import type { 
    VoidCaptcha_ActiveProvider, 
    VoidCaptcha_Response
} from "src/types";

class VoidCaptcha_SimilarImageProvider implements VoidCaptcha_ActiveProvider {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private placeholder: string = 'Select all similar images';

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
    draw(canvas: HTMLCanvasElement, response: VoidCaptcha_Response, write: (checksum: string) => void): void
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = typeof response === 'string' ? response: '';

        let label = canvas.parentElement.previousElementSibling.querySelector('label') as HTMLLabelElement;
        label.contentEditable = 'true';
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;
        label.focus();

        label.addEventListener('keyup', (event) => {
            let value = label.innerText.trim();
            if (value.length > 0) {
                label.dataset.placeholder = '';
            } else {
                label.dataset.placeholder = this.placeholder;
            }
            write(value);
        });
    }

}

export default VoidCaptcha_SimilarImageProvider;
