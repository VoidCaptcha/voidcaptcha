import { 
    VoidCaptcha_BotScore, 
    VoidCaptcha_Config, 
    VoidCaptcha_PassiveProvider 
} from "src/types";

class VoidCaptcha_ProofOfWorkProvider implements VoidCaptcha_PassiveProvider {

    /**
     * Unique Provider Name
     */
    get name(): string {
        return 'proof-of-work';
    }

    /**
     * Boolean State about provider type
     */
    get passive(): true {
        return true;
    }

    /**
     * Start Block, used for the PoW task.
     */
    private block: string;

    /**
     * PoW Difficulty
     */
    private difficulty: number;

    /**
     * PoW Timeout
     */
    private timeout: number;

    /**
     * Create a new Proof-Of-Work Provider instance.
     * @param difficulty Desired pow difficulty.
     * @param timeout Desired timeout, in which the pow task must been finished.
     */
    public constructor(difficulty: number = 4, timeout: number = 20000) {
        this.block = null;
        this.difficulty = difficulty;
        this.timeout = timeout;
    }

    /**
     * Initialize Provider
     */
    public init(config: VoidCaptcha_Config): void {

        // Request Block via fetch

        this.block = 'data';
        this.difficulty = 4;
        this.timeout = 20 * 1000;        // Timeout after 20 seconds
    }

    /**
     * Verify Passive Provider
     */
    public process(score: VoidCaptcha_BotScore): Promise<VoidCaptcha_BotScore>
    {
        return new Promise((resolve, reject) => {
            let webWorkerURL = URL.createObjectURL(new Blob([
                '(', this.webWorker(), ')()'
            ], { type: 'application/javascript' }));

            // Create WebWorker
            let worker = new Worker(webWorkerURL);
            worker.onmessage = (event) => {
                let hash = event.data.hash;
                let difficulty = event.data.difficulty;
                
                let startsWith = hash.substr(0, difficulty) === Array(difficulty + 1).join('0');
                let lastNumber = parseInt(hash.substr(-1));
                if (startsWith && !isNaN(lastNumber)) {
                    score.decrease(20);
                }

                worker.terminate();
                resolve(score);
            };
            worker.onerror = (event) => {
                worker.terminate();
                resolve(score);
            }
            worker.postMessage({
                block: this.block,
                difficulty: this.difficulty,
                timeout: this.timeout
            });
    
            // Destroy URL Object
            URL.revokeObjectURL(webWorkerURL);
        });
    }

    /**
     * Main Proof of work WebWorker Task
     * @returns 
     */
    private webWorker() {
        return function () {
            addEventListener('message', (event) => {
                let block = event.data.block;
                let difficulty = event.data.difficulty;
                let timeoutTime = event.data.timeout;

                let hash;
                let nonce = 0;
                let encoder = new TextEncoder;
                let timeout = false;
                let timeStart = Date.now();

                /**
                 * Check calculated hash value 
                 * @param value 
                 */
                function check(value) {
                    hash = Array.from(new Uint8Array(value)).map(
                        c => c.toString(16).padStart(2, '0')
                    ).join('');

                    let startsWith = hash.substr(0, difficulty) === Array(difficulty + 1).join('0');
                    let lastNumber = parseInt(hash.substr(-1));
                    if (startsWith && !isNaN(lastNumber)) {
                        report();
                    } else {
                        calculate();
                    }
                }

                /**
                 * Report to Provider
                 */
                function report() {
                    postMessage({ 
                        data: event.data,
                        block: block, 
                        difficulty: difficulty,
                        hash: hash, 
                        time: Date.now() - timeStart 
                    });
                }

                /**
                 * Calculate Hash Value
                 * @returns 
                 */
                function calculate() {
                    if (timeout) {
                        return report();
                    }

                    let buffer = encoder.encode(hash + (nonce++));
                    crypto.subtle.digest('SHA-512', buffer.buffer).then(check, report);
                }

                // Run
                setTimeout(() => { timeout = true }, timeoutTime);
                calculate();
            });
        }.toString();
    }

}

export default VoidCaptcha_ProofOfWorkProvider;
