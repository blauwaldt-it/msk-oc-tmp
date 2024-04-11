import './main.css'

import { baseInits } from '../lib/baseInits'
import { numberLineWithAnnotations } from '../lib/numberLineWithAnnotations'

const base = new baseInits( {
	container: 'container',

	addSendChangeState: function () {
		// global state: local states ORed
		const vn = 'V_Status_1';
		const stat = Object.keys( this.FSMVarsSent ).some(
			k => k!==vn && k.startsWith('V_Status') && this.FSMVarsSent[k]
		) ? 1 : 0;

		if ( !( vn in this.FSMVarsSent) || this.FSMVarsSent[vn]!==stat ) {
			this.postVariable( vn, stat );
		}
	}
} );

const width = 440;
const yLabDist = 25;
const labWidth = 100;
const labHeight = 35;

var y = 30;
const dats = [
	{ v1: '5000', v2: '6000', vn: '1a', },
	{ v1: '2500', v2: '4500', vn: '1b', },
	{ v1: '10000', v2: '20000', vn: '1c', },
	{ v1: '460000', v2: '560000', vn: '1d', },
];

const inputRegexp = '^[0-9]{0,7}$';

let ios = [];

dats.forEach( (dat,id) => {

	ios.push( new numberLineWithAnnotations( base, {
		numberLine: {
			type: 'none',
			y: y,
			x: (base.width-width)/2,
			width: width,
			valFrom: -1, valTo: 21,
		},
		annotations: [
			{ y: y+yLabDist, toValue: 0, text: dat.v1,		height: labHeight, width: labWidth, annotationTickHeightBottom: 0, toValueReadonly: 1, textReadonly: 1, },
			{ y: y+yLabDist, toValue: 10, text: '',			height: labHeight, width: labWidth, inputRegexp, annotationTickHeightBottom: 0, toValueReadonly: 1, },
			{ y: y+yLabDist, toValue: 20, text: dat.v2,		height: labHeight, width: labWidth, annotationTickHeightBottom: 0, toValueReadonly: 1, textReadonly: 1, },
		],
		logObjectId: id*100,

		FSMVariableName: dat.vn,
		scoreDef: function () {
			return {
				[`V_Input_${dat.vn}`]: +( this.annotations[1].frame.value ),
			}
		},

	}) );
	y += 100;

})

///////////////////////////////

function getState () {

	// const state = [];
	// try {
	// 	ios.forEach( io => {
	// 		state.push = JSON.parse( io.getState() );
	// 	})
	// } catch ( e ) {
	// 	console.error(e);
	// }
	const state = ios.map( a => JSON.parse( a.getState() ) );

	return( JSON.stringify( state ) );
}

function setState (state) {

	try {
		const obj = JSON.parse(state);
		obj.forEach( (o,nr) => {
			ios[nr].setState( JSON.stringify(o) );
			// delete ios[nr] oldChangeState and call sendChangeState() to set FSMVarsSent correctly
			// (forces resend of current state, but needed by addSendChangeState)
			ios[nr].oldChangeState = null;
			base.sendChangeState( ios[nr] );
		})
	} catch (e) {
		console.error(e);
	}

}

window.getState = getState;
window.setState= setState;
