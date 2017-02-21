import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

export default {
	moduleName: 'gammasense',
	entry: 'source/index.js',
	dest: 'bundle/index.js',
	format: 'iife',
	plugins: [
		resolve(),
    commonjs(),
		babel(),
		uglify(),
	],
}