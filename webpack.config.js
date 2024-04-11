const path = require('path');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

function getCfg ( env, argv ) {

	const outName = 'jsonEditor';
	const srcDir = './json_editor';

	return {

		entry: `${srcDir}/main.js`,

		output: {
			path: path.resolve(__dirname, 'dist/jsonEditor'),
			filename: `${outName}.js`,
		},

		devtool: argv.mode==='production' ? undefined : 'source-map',

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

			new HtmlWebpackPlugin({
				filename: `${outName}.html`,
				template: `${srcDir}/main.html`,
			}),

			new MiniCssExtractPlugin({
				filename: `${outName}.css`,
			}),

		],

		optimization: {
			minimizer: [
				`...`,
				new CssMinimizerPlugin(),
			],
		},

	};
}


module.exports = ( env, argv ) => {

	const cfg = getCfg( env, argv );

	if ( env.WEBPACK_SERVE ) {
		if ( Array.isArray(cfg) ) {
			throw( "Error: Only one item must be selected for 'webpack serve'" );
		}
		if ( cfg.stats ) {
			delete( cfg.stats );
		}
		cfg.devtool = 'cheap-module-source-map';
		cfg.devServer = {
			open: {
				target: [ cfg.output.filename.replace( /\.js$/, '.html' ) ],
				app: {
					name: 'chrome',
					arguments: ['--remote-debugging-port=9222'],
				}
			}
		}
	}

	return cfg;
}
