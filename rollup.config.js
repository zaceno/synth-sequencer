import { liveServer } from 'rollup-plugin-live-server'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
import resolve from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
const PROD = !process.env.ROLLUP_WATCH

export default {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist',
            format: 'esm',
        },
    ],
    plugins: [
        PROD && del({ targets: 'dist/*' }), //cleanup dist folder
        typescript({ typescript: require('typescript') }),
        resolve(),
        PROD && terser(),
        copy({
            targets: [
                { src: 'src/index.html', dest: 'dist' },
                { src: 'src/styles/**/*', dest: 'dist/styles' },
            ],
        }),
        !PROD && liveServer({ root: 'dist/' }),
    ],
    watch: {
        include: ['src/**/*'],
    },
}
