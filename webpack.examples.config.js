const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const dist_dir = "dist/examples";

const getWebPackConfig = ( data, env, argv ) => ({

	context: path.resolve(__dirname, 'examples'),
	entry: `./${data.srcJs == '[fn]' ? `${data.item}_${data.fnExt}` : data.srcJs}.js`,
	output: {
		path: path.resolve(__dirname, dist_dir ),
		filename: `${ data.outputFilename ? data.outputFilename : `${data.item}_${data.fnExt}` }.js` ,
	},
	module: {
		rules: [

			{
				test: /\.js$/,
				use: [{
					loader: 'ifdef-loader',
					options: {
						__hasFsmVariableName: true,
						__hasScoreVariableName: typeof data.scoreVariableName !== 'undefined',
						__item: data.item,
						__itemFN: data.outputFilename ? data.outputFilename : `${data.item}_${data.fnExt}`,
						__param1: typeof data.param1 !== 'undefined' ? data.param1 : '',
						__param2: typeof data.param2 !== 'undefined' ? data.param2 : '',
						__param3: typeof data.param3 !== 'undefined' ? data.param3 : '',
					}
				}],
				exclude: /node_modules/,
			},{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
				exclude: /node_modules/,
			},{
				test: /\.(png|svg)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
					}
				}]
			// },{
			// 	test: /\.html$/,
			// 	use: ['html-loader']
			}

		]
	},
	plugins: [

		new HtmlWebpackPlugin({
			filename: data.outputFilename ? `${data.outputFilename}.html` : `${data.item}_${data.fnExt}.html`,
			template: data.srcHtml ? `./${data.srcHtml}.html` : `./main.html`,
		}),

		new webpack.DefinePlugin({
			__fsmVariableName: `'${data.fsmVarName || data.fnExt}'`,
			__scoreVariableName: data.scoreVariableName ? `'${data.scoreVariableName}'` : undefined,
			__item: `'${data.item}'`,
			__itemFN: data.outputFilename ? `'${data.outputFilename}'` : `'${data.item}_${data.fnExt}'`,
			__param1: data.param1,
			__param2: data.param2,
			__param3: data.param3,
			__batch: data.batch,
		}),

		new MiniCssExtractPlugin({
			filename: `${data.outputFilename ? data.outputFilename : `${data.item}_${data.fnExt}`}.css`,
		}),

	],

	optimization: {
		minimizer: [
			`...`,
			new CssMinimizerPlugin(),
		],
	},

	stats: 'errors-only',
	devtool: argv.mode==='production' ? undefined : 'source-map',

})


//////////////////////////////////////////////////////////////////////////////

// get bundle definitions
const { itemData } = require('./examples/itemData');


// add definitions for overview
itemData.push({
	srcJs: './overview',
	outputPath: dist_dir,
	outputFilename: `overview`,
});


// file for "webpack serve" (can be specified by 'npm run serve -- --env test=<filename>')



module.exports = ( env, argv ) => {

	// get configs for items
	const cfgs = itemData.
			filter(
				env.WEBPACK_SERVE ?
					// webpack serve: filter testfile
					data => `${data.item}_${data.fnExt}`.includes( env.test ) :
					() => true
			).
			map( data => getWebPackConfig( data, env, argv ) );


	// output number of files to be bundled
	if ( !cfgs.length ) {
		throw( "No item selected." );
	}
	if ( cfgs.length<=10 ) {
		console.info( `Bundling ${cfgs.length} file${cfgs.length>1 ? 's' : ''}:` );
		cfgs.forEach( c => console.log( `	${c.output.filename}` ) );
	} else {
		console.info( `Bundling ${cfgs.length} files.` );
	}

	const cfg = cfgs.length>1 ? cfgs : cfgs.pop();


	// additional corrections for "webpack serve"
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
