
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const scss = require('rollup-plugin-scss');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

const COPYRIGHT = `/*!
*  ${pkg.name} - ${pkg.description}
*  @file       ${pkg.main}
*  @version    ${pkg.version}
*  @author     ${pkg.author}${pkg.contributors? "\n |\t\t\t\t" + pkg.contributors.join("\n |\t\t\t\t"): ""}
*  
*  @website    ${pkg.homepage}
*  @license    ${pkg.license} License
*  @copyright  Copyright © 2021 - ${(new Date()).getFullYear()} ${pkg.copyright}
*/`;
const COPYSMALL = `/*! ${pkg.name} | @version ${pkg.version} | @license ${pkg.license} | @copyright ${pkg.copyright} */`;

function output(version) {
    return [
        {
            banner: COPYRIGHT,
            compact: false,
            dir: `dist`,
            entryFileNames: `${version}/voidcaptcha.bundle.js`,
            esModule: version === 'esm',
            format: `${version === 'js' ? 'umd' : 'es'}`,
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
            entryFileNames: `${version}/voidcaptcha.bundle.min.js`,
            esModule: version === 'esm',
            format: `${version === 'js' ? 'umd' : 'es'}`,
            intro: '"use strict";',
            name: 'VoidCaptcha',
            strict: false,
            sourcemap: true,
            plugins: [
                terser(),
            ]
        }
    ]
}

module.exports = (() => {
    return [
        {
            input: 'src/ts/index.ts',
            output: output('js'),
            plugins: [
                commonjs({}),
                replace({
                    preventAssignment: true,
                    values: {
                        __VERSION__: pkg.version,
                    }
                }),
                scss({
                    name: 'css/voidcaptcha.css',
                    fileName: 'css/voidcaptcha.css',
                    sourceMap: true,
                    sass: require('sass'),
                    outputStyle: 'expanded'
                }),
                typescript({})
            ]
        },
        {
            input: 'src/ts/index-esm.ts',
            output: output('esm'),
            plugins: [
                commonjs({}),
                replace({
                    preventAssignment: true,
                    values: {
                        __VERSION__: pkg.version,
                    }
                }),
                scss({
                    name: 'css/voidcaptcha.min.css',
                    fileName: 'css/voidcaptcha.min.css',
                    sourceMap: true,
                    sass: require('sass'),
                    outputStyle: 'compressed'
                }),
                typescript({})
            ]
        }
    ];
});
