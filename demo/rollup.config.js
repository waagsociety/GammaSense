import resolve from 'rollup-plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
	entry: 'source/index.js',
	dest: 'bundle/index.js',
	moduleName: 'app',
	format: 'iife',
	plugins: [
		resolve(),
		serve(),
		livereload(),
		babel(),
	],
}