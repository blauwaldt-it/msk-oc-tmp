import './main.css'

import { baseInits } from '../libs/baseInits'
import { numberLineWithArcs } from '../libs/numberLineWithArcs'

const tol = 0.5;

const base = new baseInits( { container: 'container' } );
const io = new numberLineWithArcs( base, {

	numberLine: {
		type: 'ticks',
		y: base.height/2,
		x: 60,
		width: 300,
		valFrom: -2, valTo: 22,
		arrowDist: 30,
		labels: [ 0, 10, 20 ],
		minTicks: {
			min: 0,
		}
	},

	arcWidth: 2,
	arcHeight: 30,

	tickHeight: 0,

	readonly: 0,

	FSMVariableName: __fsmVariableName,
/// #if __item == 'msk_start_instruction'
	scoreDef: undefined,
/// #else
	scoreDef: function () {
		const arcs = this.arcs;
		if (	this.compArcs( [ [0,5], [5,10], [10,15] ], tol ) ||
				this.compArcs( [ [0,3], [3,6], [6,9], [9,12], [12,15] ], tol ) ) return 1;

		if ( this.arcs.length===0 ) return -1;

		if (	this.compArcs( [ [0,3], [3,8] ], tol ) ||
				this.compArcs( [ [0,5], [5,8] ], tol ) ) return -3;

		const arc0from = this.arcs[0].from;
		if ( this.arcs.length==2 &&
				Math.abs( this.arcs[1].to - (arc0from+8) ) <= tol && (
					Math.abs( this.arcs[0].to - (arc0from+3) ) <= tol &&
					Math.abs( this.arcs[1].from - (arc0from+3) ) <= tol
				||
					Math.abs( this.arcs[0].to - (arc0from+5) ) <= tol &&
					Math.abs( this.arcs[1].from - (arc0from+5) ) <= tol ) ) return -4;

		return -2;
	},
/// #endif
});
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

///////////////////////////////

import demo_cursor from '../libs/img/demo_cursor.png'
import demo_cursor_click from '../libs/img/demo_cursor_click.png'

import { demoAni } from '../libs/demoAni'

const startDemoAni = !( new URL( window.location.href ) ).searchParams.has('noDemoAni');

const ani = startDemoAni && new demoAni( base.stage, {

	repeats: 2,
	beginDelay: 300,

	val2x: io.numberLine.val2x.bind(io.numberLine),
	val2y: (ys) => io.numberLine.y+ys,
	getState: io.getState.bind(io),
	setState: io.setState.bind(io),

	cursor: {
		demo: {	cursor: demo_cursor, cursorOfX: 8, cursorOfY: 3, },
		demo_click: { cursor: demo_cursor_click, cursorOfX: 21, cursorOfY: 18, }
	},

	ani: [
		// create arcs
		{ act:'moveLin', x:'4s', y:'0s', 		duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 									pause:400,		cursor:'demo_click', },
		{ act:'moveArcTop', x:'12s', radius:40,	duration:500,	pause:300,		cursor:'demo_click', },
		{ act:'moveArcTop', x:'17s', radius:40,	duration:400,	pause:200,		cursor:'demo_click', },
		{ act:'moveArcTop', x:'20s', radius:40,	duration:300,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup',										pause:0,		cursor:'demo', },
		{ act:'moveLin', x:'15s', y:'50s', 		duration:200,	pause:200,		cursor:'demo', },

		// move arcs
		{ act:'moveLin', x:'12s', y:'0s', 		duration:400,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 									pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x:'8s', y:'20s', 		duration:400,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup',										pause:300,		cursor:'demo', },
		{ act:'moveLin', x:'17s', y:'0s', 		duration:300,	pause:300,		cursor:'demo', },
		{ event:'mousedown', 									pause:300,		cursor:'demo_click', },
		{ act:'moveLin', x:'14s', y:'20s', 		duration:200,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup',										pause:0,		cursor:'demo', },
		{ act:'moveLin', x:'9s', y:'50s', 		duration:200,	pause:200,		cursor:'demo', },

		// delete arcs
		{ act:'moveLin', x:'9s', y:'-30s', 		duration:300,	pause:200,		cursor:'demo', },
		{ 														pause:100,		cursor:'demo_click', },
		{ event:'mousedown', 									pause:200,		cursor:'demo_click', },
		{ 									 					pause:200,		cursor:'demo', },
		{ act:'moveLin', x:'7s', y:'-30s', 		duration:200,	pause:100,		cursor:'demo', },
		{ 														pause:100,		cursor:'demo_click', },
		{ event:'mousedown', 									pause:200,		cursor:'demo_click', },
		{ 									 					pause:100,		cursor:'demo', },
		{ act:'moveLin', x:'15s', y:'-30s', 	duration:200,	pause:100,		cursor:'demo', },
		{ 														pause:100,		cursor:'demo_click', },
		{ event:'mousedown', 									pause:200,		cursor:'demo_click', },
		{ 									 					pause:100,		cursor:'demo', },

		{ 									 					pause:300,		cursor:'demo', },

	],

})


