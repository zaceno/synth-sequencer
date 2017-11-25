import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import less from 'rollup-plugin-lessify'
import {minify} from 'uglify-es'

const prod = !process.env.ROLLUP_WATCH
const dev = !!process.env.ROLLUP_WATCH

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    sourcemap: dev ? 'inline' : false,
    format: 'iife',
  },
  plugins: [
    less({
        insert: true,
//        include: 'src/style/*'
    }),
    resolve({ jsnext: true }),
    commonjs(),
    prod && uglify({}, minify),
    dev && livereload('dist'),
    dev && serve({
      contentBase: ['dist'],
      historyApiFallback: true,
      port: 8080,
    })
  ]
}