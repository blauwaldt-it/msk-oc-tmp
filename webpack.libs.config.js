const path = require('path');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const babel_loader = {
	test: /\.(js)$/,
	exclude: /node_modules/,
	use: [{
		loader: "babel-loader",
		options: {
			presets: [
			[
				'@babel/preset-env',
				{
					// 'debug': true,
					'useBuiltIns': 'usage',
					// 'corejs': { version: 3.26, proposals: true },
					'corejs': { version: 3.26 },
					'targets': [ "last 2 years", "not dead"  ]
				},
			],
			],
		},
	}],
}

module.exports = [{

	/////////////////////////////////// MSK Text

	entry: './libs/mskt.js',

	output: {
		path: path.resolve(__dirname, 'dist/libs'),
		filename: 'mskt.js',
		library: 'mskt',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},

	devtool: false,

	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
				exclude: /node_modules/,
			},{
				test: /\.(png|svg)$/,
				type: 'asset/inline',
			},
			babel_loader,
		],
	},

	plugins: [

		new MiniCssExtractPlugin({
			filename: 'mskt.css',
		}),

	],

	optimization: {
		minimizer: [
			`...`,
			new CssMinimizerPlugin(),
		],
	},

},{
	/////////////////////////////////// MSK Grafik

	entry: './libs/mskgr.js',

	output: {
		path: path.resolve(__dirname, 'dist/libs'),
		filename: 'mskgr.js',
		library: 'mskgr',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},

	devtool: false,

	module: {
		rules: [

			{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
				exclude: /node_modules/,
			},{
				test: /\.(png|svg)$/,
				type: 'asset/inline',
			},
			babel_loader,
		],
	},

	plugins: [

		new MiniCssExtractPlugin({
			filename: 'mskgr.css',
		}),

	],

	optimization: {
		minimizer: [
			`...`,
			new CssMinimizerPlugin(),
		],
	},

}];
