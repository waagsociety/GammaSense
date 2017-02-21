import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'

export default {
	entry: 'source/index.js',
	dest: 'bundle/index.js',
	moduleName: 'app',
	format: 'iife',
	plugins: [
		resolve(),
		commonjs(),
		serve(),
		livereload(),
		babel(),
	],
}