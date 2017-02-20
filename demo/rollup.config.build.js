import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
	moduleName: 'gammasense',
	entry: 'source/index.js',
	dest: 'bundle/index.js',
	format: 'iife',
	plugins: [
		resolve(),
		babel(),
		// uglify(),
	],
}