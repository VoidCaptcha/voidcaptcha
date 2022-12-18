import { 
    VoidCaptcha_BotScore, 
    VoidCaptcha_PassiveProvider 
} from "src/types";

class VoidCaptcha_DetectProvider implements VoidCaptcha_PassiveProvider {

    private rules: { [category: string]: { [rule: string]: number } };

    /**
     * Unique Provider Name
     */
    get name() {
        return 'detect';
    }

    /**
     * Boolean State about provider type
     */
    get passive(): true {
        return true;
    }

    /**
     * Recognizable UserAgent Names
     * @link https://github.com/matomo-org/device-detector/blob/master/regexes/bots.yml
     * 
     * The following list has been created using Matomo's device detector package. The purpose of 
     * this list is to clearly separate the most obvious bots. However, serious CAPTCHA solving 
     * libraries (and services) clearly do not identify themselves using one of the words below 
     * and thus, the user agent check is completely useless for this kind of protection.
     * 
     * Anyways, we separate the user agent strings into the following three categories. We don't 
     * care about minor "false positives", since the only consequence is to solve a puzzle. 
     *      high        99.95 % bot, should identify itself using an active provider
     *      normal      50.42 % bot, stinks like a bot, but could also be a human (or a cat)
     *      low         < 5.0 % bot, could be a weird browser or a modified user agent
     */
    get userAgentRegex(): { [key: string]: string } {
        return {
            'high': [
                /* Malicious Namings */
                'always(.*)online',
                'archiver',
                'browsershot',
                'crawler',
                'diagnostic',
                '(down|up)time',
                'indexer',
                'monitoring',
                'scanner',
                'sp(i|y)der',

                /* Companies or Products */
                'aboundex',
                'addthis',
                'alexa',
                'ahref',
                'arachni',
                'archive\.org',
                'butterfly',
                'cloudflare',
                'coccoc',
                'curios',
                'domain(.+)',
                'duckduck',
                'ezoom',
                'let\'?s(.*)encrypt',
                'httpmon',
                'outbrain',
                'pinterest',
                'postm(a|e)n',
                'quora',
                'yandex',
            ].join('|'),

            'normal': [
                /* Malicious Namings */
                'archive',
                'ask(.+)',
                'audit',
                'backlink',
                'batch',
                '(.+)bot',
                'checker',
                'collect',
                'diagnose',
                'extractor',
                'fetch',
                'generator',
                'grab',
                'headless',
                'http',
                'hunter',
                'lookup',
                'index',
                'insight',
                'inspector',
                'monitor',
                'optimize',
                'probe',
                'provider',
                'proxy',
                'review',
                'riddle',
                'scan',
                'schedule',
                'scrap',
                'screenshot',
                'search',
                'seeker',
                'service',
                'share',
                'sucker',
                'synthetics',
                'testing',
                'transcoder',
                'validator',
                'veri(f|t)y',

                /* Companies or Products */
                'amazon',
                'apache',
                'facebook',
                'feedburner',
                'feedly',
                'feedpin',
                'gmail',
                'hubspot',
                'kaspersky',
                'linked',
                'mastodon',
                'php',
                'python',
                'reddit',
                'shopify',
                'torrent',
                'twitter',
                'W3C\_',
                'wordpress',
            ].join('|'),

            'low': [
                /* Malicious Namings */
                '\.com',
                'agent',
                'blog',
                'bin',
                'bot',
                'cache',
                'data',
                'e?mail',
                'engine',
                'explorer',
                'favicon',
                'feed',
                'filter',
                'guide',
                'improve',
                'modified',
                'online',
                'parse',
                'preview',
                'reader',
                'rss',
                'seo',
                'server',
                'shop',
                'site',
                'sql',
                'scrap',
                'ssl',
                'stats?(istic)?',
                'wiki',
                
                /* Companies or Products */
                'google'
            ].join('|')
        };
    }

    /**
     * Create a new DetectProvider instance.
     */
    public constructor() {

        this.rules = {

            /**
             * User Agent Score
             */
            userAgent: {
                malicious:      50,
                suspicious:     25,
                strange:        10,
                empty:          10,
                valid:          -5
            },

            


        };

    }

    /**
     * Initialize Provider
     */
    init(): void
    {
        let browserScore = 0;

        /**
         * We're using the user agent to separate "normal" bots and / or bad-written crawlers and 
         * CAPTCHA services only.
         */
        this.detectUserAgent();

        /**
         * Detecting browser and device abilities allows us to separate old devices / old CAPTCHA 
         * service solutions from the professional stuff and real users.
         */
        this.detectBrowserAndDevice();

        /**
         * Let's observe the user, when the user agent, browser and device details seems like a 
         * normal user. About Privacy: The detection below is done per request, not stored anywhere 
         * and is never send to any additional service provider or server.
         */
        if (browserScore < 30) {
            this.startUserObserver();
        }
    }

    /**
     * Detect and Evaluate User Agent
     */
    private detectUserAgent(): number {
        let userAgent = navigator.userAgent.trim();

        if (userAgent.length) {

        }
        return 1;
    }

    /**
     * Detect and Evaluate Browser and Device Details
     */
    private detectBrowserAndDevice(): number {
        let browser = 'chrome';

        // Headless Browser Detection
        // It's quite impossible to detect a headless browser, at least when we tackle real CAPTCHA 
        // programmers. However, we just wanna sort out some basic edge-cases and remain our focus 
        // on real challenges. (An those edge cases just "fallback" to the active providers anyways)
        let couldBeHeadless = /headless/.test(navigator.userAgent) ? 40 : 0;

        if ((window.screen['width'] || 0) === 800 && (window.screen['height'] || 0) === 600) {
            if (window.screen.orientation['type'].indexOf('portrait') === 0 && window.outerWidth == 800 && window.outerHeight === 600) {
                couldBeHeadless += 20;  // Portrait Mode using an 800x600 screen & browser-size? Nice!
            } else {
                couldBeHeadless += 15;  // Haven't seen a 800x600 screen for a long time
            }
        }
        if ((navigator.plugins || []).length === 0) {
            couldBeHeadless += 5;       // Plugins aren't set in headless browsers (but also not in private tabs)
        }
        if (browser === 'chrome' && !('chrome' in window)) {
            couldBeHeadless += 5;       // window.chrome is not set on headless browsers (but only effects chrome)
        }
        if ('webdriver' in navigator && navigator.webdriver) {
            couldBeHeadless += 5;       // navigator.webdriver is only set on headless browsers (but not on all headless ones)
        }
        if (!('pdfViewerEnabled' in navigator) || !navigator.pdfViewerEnabled) {
            couldBeHeadless += 5;       // headless browsers can't preview PDFs inline (but some normal browsers cannot either)
        }

        // Feature Detection
        // Of course, a deprecated browser does not mean that the current visitor is a bot. However, 
        // we still don't try to detect bots here, we just wanna sort out some edge-cases again.
        let deprecatedBrowser = 0;

        if (typeof window.Gamepad === 'undefined') {
            deprecatedBrowser += 25;
        }
        if (typeof window.Worker === 'undefined') {
            deprecatedBrowser += 25;
        }
        if (typeof window.crypto === 'undefined' || typeof window.crypto.subtle === 'undefined') {
            deprecatedBrowser += 50;
        }




        return 1;
    }

    /**
     * Start User Observer
     */
    private startUserObserver(): void {

    }

    /**
     * Verify Passive Provider
     */
    process(score: VoidCaptcha_BotScore): Promise<VoidCaptcha_BotScore>
    {
        return new Promise((resolve, reject) => {
            resolve(score);
        });
    }

}

export default VoidCaptcha_DetectProvider;
