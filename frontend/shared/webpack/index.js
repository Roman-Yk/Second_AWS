const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const envConfig = (env) => require(`./webpack.${env.type}.js`)(env);

module.exports = options => env => {
	console.log('BUNDLE: ', env);
	const config = webpackMerge.smart(baseConfig(env), options);
	return webpackMerge.smart(config, envConfig(env));
}