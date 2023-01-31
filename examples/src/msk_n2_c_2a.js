import './main.css'

import { baseInits } from '../../lib/src/baseInits'
import { numberLineWithArcs } from '../../lib/src/numberLineWithArcs'
import { demoAni } from '../../lib/src/demoAni'

import demo_cursor from '../../lib/img/demo_cursor.png'
import demo_cursor_click from '../../lib/img/demo_cursor_click.png'

const base = new baseInits( { container: 'container' } );

const inputRegexp = '^[0-9]{0,4}$';
const io = new numberLineWithArcs( base, {

	numberLine: {
		type: 'none',
		y: 65,
		x: 60,
		width: base.width-2*60,
		valFrom: -10, valTo: 1010,
	},

	arcWidth: 2,
	arcMinWidth: 8,
	arcHeight: 40,
	arcs: [
		{ from: 0, to: 200, 	arcReadonly: 1, },
		{ from: 200, to: 400, 	arcReadonly: 1, },
	],

	tickLabelDistance: 40,
	tickFrameWidth: 2,
	ticks: [
		{ value: 0, 	label: 0,		width: 60, fontSize: 20,	tickReadonly: 1, labelReadonly: 1},
		{ value: 200, 	label: 200, 	width: 60, fontSize: 20, 	tickReadonly: 1, labelReadonly: 1 },
		{ value: 400, 	label: "", 		width: 60, fontSize: 20, 	tickReadonly: 1, inputRegexp, },
		{ value: 1000,	label: '1000', 	width: 60, fontSize: 20, 	tickReadonly: 1, labelReadonly: 1 },
	],

	newTickLabelDefaults: {
		label: "",
		width: 60,
		fontSize: 20,
		inputRegexp,
	},

	FSMVariableName: '2a',

	statusVarDef: function () {
		const st = this.getChState();
		return st.arcs.length != this.initData.arcs.length && st.ticks.every( l => l.label );
	},
});

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
		{ act:'moveLin', x: '400s', y: '0s',	 	duration:400,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ act:'moveArcTop', x: '550s', y: '0s', radius: 30, 	duration:400,	pause:200,		cursor:'demo_click', },
		{ act:'moveArcTop', x: '750s', y: '0s', radius: 30, 	duration:400,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:100,		cursor:'demo', },
		{ act:'moveLin', x: '700s', y: '30s',	 	duration:300,	pause:200,		cursor:'demo', },

		{ act:'moveLin', x: '550s', y: '0s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: '650s', y: '0s',	 	duration:300,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:200,		cursor:'demo', },

		{ act:'moveLin', x: '750s', y: '0s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: '1000s', y: '0s',	 	duration:300,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:400,		cursor:'demo', },

		{ act:'moveLin', x: '650s', y: '60s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ 					 										pause:300,		cursor:'demo_click', },
		{ event:'click', 											pause:400,							 },
		{ textInput:'9',											pause:150, 							 },
		{ textInput:'9',											pause:150, 							 },
		{ textInput:'9',											pause:150, 							 },
		{ act:'moveLin', x: '750s', y: '60s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ event:'click', 											pause:200,		cursor:'demo_click', },
		{ 				 											pause:300,		cursor:'demo', },

		{ act:'moveLin', x: '680s', y: '-30s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ 				 											pause:200,		cursor:'demo_click', },
		{ event:'mousedown', 										pause:300,		cursor:'demo', },
		{ act:'moveLin', x: '620s', y: '-30s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ 				 											pause:200,		cursor:'demo_click', },
		{ event:'mousedown', 										pause:600,		cursor:'demo', },

	],
})

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

