import type {
    VoidCaptcha_ActiveProvider, 
    VoidCaptcha_Response 
} from "src/types";

class VoidCaptcha_TextProvider implements VoidCaptcha_ActiveProvider {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private placeholder: string = 'Enter CAPTCHA Code here';

    /**
     * Unique Provider Name
     */
    get name() {
        return 'text';
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
        console.log(response);
        if (typeof this.ctx !== 'undefined') {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        }

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
            write(value);
        });
    }

}

export default VoidCaptcha_TextProvider;
