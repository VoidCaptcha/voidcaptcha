import { VoidCaptcha_ActiveProvider } from "src/types";

class VoidCaptcha_PuzzleSlideProvider implements VoidCaptcha_ActiveProvider {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private placeholder: string = 'Slide until the piece fits';

    /**
     * Unique Provider Name
     */
    get name() {
        return 'slide-puzzle';
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
    draw(canvas: HTMLCanvasElement, response: unknown, write: (checksum: string) => void): void
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.save();

        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = response['source'];

        const piece = new Image();
        piece.onload = (event) => {
            this.ctx.drawImage(piece, 0, 30);
        };
        piece.src = response['piece'];

        let label = canvas.parentElement.previousElementSibling.querySelector('label') as HTMLLabelElement;
        label.contentEditable = 'true';
        label.innerText = '';
        label.dataset.placeholder = this.placeholder;

        let slider = document.createElement('INPUT') as HTMLInputElement;
        slider.type = 'range';
        slider.value = '0';
        slider.min = '0';
        slider.max = '100';
        slider.addEventListener('input', (event) => {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.drawImage(image, 0, 0);
            this.ctx.drawImage(piece, (canvas.width-piece.width) / 100 * parseInt(slider.value), 30);
            write(((canvas.width-piece.width) / 100 * parseInt(slider.value)).toString());
        });
        canvas.parentElement.appendChild(slider);
    }

}

export default VoidCaptcha_PuzzleSlideProvider;
