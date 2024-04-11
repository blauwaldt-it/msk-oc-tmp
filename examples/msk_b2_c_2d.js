import './main.css'

import { baseInits } from '../libs/baseInits'
import { barSlider } from '../libs/barSlider'
import { demoAni } from '../libs/demoAni'

import demo_cursor from '../libs/img/demo_cursor.png'
import demo_cursor_click from '../libs/img/demo_cursor_click.png'

const base = new baseInits( {
	container: 'container',

	addSendChangeState: function () {
		// global state: local states ORed
		const vn = 'V_Status_2d';
		const stat = Object.keys( this.FSMVarsSent ).some(
			k => k!==vn && k.startsWith('V_Status') && this.FSMVarsSent[k]
		) ? 1 : 0;

		if ( !( vn in this.FSMVarsSent) || this.FSMVarsSent[vn]!==stat ) {
			this.postVariable( vn, stat );
		}
	}
} );

const width = 450;
const height = 20;
const sliderHeight = 40;

const dats = [
	{ y: 30, vn: '2d_1_bar', },
	{ y: 130, vn: '2d_2_bar', },
	{ y: 230, vn: '2d_3_bar', },
];

let ios = [];

dats.forEach( (dat,id) => {

	ios.push( new barSlider( base, {

		x: 30, y: dat.y,
		width, height,
		sliderHeight,
		labels: [
			{ val: 0, text: '0 %', },
			{ val: 1, text: '100 %', },
		],

		FSMVariableName: dat.vn,
		scoreDef: function () {
			return {
				[`V_Input_${dat.vn}`]: Math.round( this.pos*1000 ),
			}
		},
	} ));

})

///////////////////////////////

const startDemoAni = !( new URL( window.location.href ) ).searchParams.has('noDemoAni');

const ani = startDemoAni && new demoAni( base.stage, {

	repeats: 1,
	beginDelay: 300,

	val2x: ios[0].val2x.bind(ios[0]),
	val2y: (ys) => ios[0].y+ios[0].height/2+ys,
	getState: ios[0].getState.bind(ios[0]),
	setState: ios[0].setState.bind(ios[0]),

	cursor: {
		demo: {	cursor: demo_cursor, cursorOfX: 8, cursorOfY: 3, },
		demo_click: { cursor: demo_cursor_click, cursorOfX: 21, cursorOfY: 18, }
	},

	ani: [
		{ act:'moveLin', x:'0s', y:'0s', 		duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 									pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x:'0.7s', y:'30s', 	duration:400,	pause:100,		cursor:'demo_click', },
		{ act:'moveLin', x:'0.3s', y:'30s', 	duration:300,	pause:200,		cursor:'demo_click', },
		{ act:'moveLin', x:'0.7s', y:'30s', 	duration:300,	pause:200,		cursor:'demo_click', },
		{ act:'moveLin', x:'0s', y:'30s', 		duration:300,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup', 										pause:400,		cursor:'demo', },
	],
})

///////////////////////////////

function getState () {

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
