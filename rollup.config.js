
const fs = require('fs');
const path = require('path');
const replace = require('@rollup/plugin-replace');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');


const COPYRIGHT = `/*!
|  ${pkg.name} - ${pkg.description}
|  @file       ${pkg.main}
|  @version    ${pkg.version}
|  @author     ${pkg.author}${pkg.contributors? "\n |\t\t\t\t" + pkg.contributors.join("\n |\t\t\t\t"): ""}
|  
|  @website    ${pkg.homepage}
|  @license    ${pkg.license} License
|  @copyright  Copyright © 2021 - ${(new Date()).getFullYear()} ${pkg.copyright}
*/`;
const COPYSMALL = `/*! ${pkg.name} | @version ${pkg.version} | @license ${pkg.license} | @copyright ${pkg.copyright} */`;

module.exports = (() => {
    return [
        {
            input: 'src/ts/index.ts',
            output: [
                {
                    amd: {
                        id: 'VoidCaptcha'
                    },
                    banner: COPYRIGHT,
                    compact: false,
                    dir: `dist`,
                    entryFileNames: `js/voidcaptcha.bundle.js`,
                    esModule: false,
                    format: 'umd',
                    intro: '"use strict";',
                    name: 'VoidCaptcha',
                    strict: false,
                    sourcemap: true,
                    plugins: [ ]
                },
                {
                    amd: {
                        id: 'VoidCaptcha'
                    },
                    banner: COPYSMALL,
                    compact: true,
                    dir: `dist`,
                    entryFileNames: `js/voidcaptcha.bundle.min.js`,
                    esModule: false,
                    format: 'umd',
                    intro: '"use strict";',
                    name: 'VoidCaptcha',
                    strict: false,
                    sourcemap: true,
                    plugins: [
                        terser()
                    ]
                }
            ],
            plugins: [
                replace({
                    preventAssignment: true,
                    values: {
                        __VERSION__: pkg.version,
                    }
                }),
                typescript({})
            ]
        },
        
        {
            input: 'src/ts/index.ts',
            output: [
                {
                    banner: COPYRIGHT,
                    compact: false,
                    dir: `dist`,
                    entryFileNames: `esm/voidcaptcha.bundle.js`,
                    esModule: true,
                    format: 'es',
                    intro: '"use strict";',
                    name: 'VoidCaptcha',
                    strict: false,
                    sourcemap: true,
                    plugins: [
                    ]
                },
                {
                    banner: COPYSMALL,
                    compact: true,
                    dir: `dist`,
                    entryFileNames: `esm/voidcaptcha.bundle.min.js`,
                    esModule: true,
                    format: 'es',
                    intro: '"use strict";',
                    name: 'VoidCaptcha',
                    strict: false,
                    sourcemap: true,
                    plugins: [
                        terser()
                    ]
                }
            ],
            plugins: [
                replace({
                    preventAssignment: true,
                    values: {
                        __VERSION__: pkg.version,
                    }
                }),
                typescript({})
            ]
        }
    ];
});
