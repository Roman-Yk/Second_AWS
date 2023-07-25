const fs = require("fs");
const path = require("path");

const webpackConfig = require("@tms/shared/webpack/");
const { getEntriesFrom } = require("@tms/shared/webpack/addons");

const entries = getEntriesFrom("pages");

module.exports = (env) => webpackConfig({
	entry: entries,
	output: {
		// path: path.resolve(__dirname, '../../server/tms_server/static/js'),
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
})(env);