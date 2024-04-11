import './main.css'

import { baseInits } from '../libs/baseInits'
import { numberLineWithArcs } from '../libs/numberLineWithArcs'
import { demoAni } from '../libs/demoAni'

import { isBetween } from '../libs/common'

import demo_cursor from '../libs/img/demo_cursor.png'
import demo_cursor_click from '../libs/img/demo_cursor_click.png'

const varNam = "1a_1";

const base = new baseInits( { container: 'container' } );

const inputRegexp = '^($|[0-9]{1,3}([,.][0-9]{0,2})?)$';
const width = 790;
const io = new numberLineWithArcs( base, {

	numberLine: {
		type: 'ticks',
		y: 30,
		x: (base.width-width-30)/2,
		width: width,
		valFrom: 2.98, valTo: 4.22,
		minTicks: { vals: 0.01, min: 3, max: 4.22 },
		midTicks: { vals: 0.05, min: 3, max: 4.2 },
		majTicks: { vals: 0.1, min: 3, max: 4.2 },
		labels: [ 3, [ 3.1, "3,1" ], [ 3.2, "3,2" ], [ 3.3, "3,3" ] ],
		arrowDist: 30,
	},

	tickLabelDistance: 50,
	tickFrameWidth: 2,

	newTickLabelDefaults: {
		label: "",
		width: 75,
		fontSize: 20,
		inputRegexp,
	},

	dontDelEmptyTicks: true,
	maxTicks: 2,
	neverCreateArcs: true,

	statusVarDef: function () {
		const res = {
			// [`V_Status_${varNam}_1`]: +( this.ticks.length>0 ),
			// [`V_Status_${varNam}_2`]: +( this.ticks.length>1 ),
		}
		res[`V_Status_${varNam}`] = +( this.ticks.length>1 && this.ticks.every( t => t.label.length>0 ) );
		return res;
	},

	FSMVariableName: varNam,
	scoreDef: function () {

		let i = this.ticks.findIndex( t => t.labelObj.value.match( /^0*3[.,]120*$/ ) );
		const pos_3_12 = i>-1 ? +this.ticks[i].value : NaN;
		i = this.ticks.findIndex( t => t.labelObj.value.match( /^0*3[.,]60*$/ ) );
		const pos_3_6 = i>-1 ? +this.ticks[i].value : NaN;
		let erg = -2;

		if (	isBetween( pos_3_12, 3.115, 3.125 ) &&
				isBetween( pos_3_6, 3.595, 3.605 ) ) 	erg = 1;

		else if ( this.ticks.length<2 || !this.ticks.every( t => t.label.length>0 ) ) 	erg = -1;
		else if ( this.ticks.length<2 ) 	erg = -2;

		else if ( this.ticks.some( v => isBetween( v.value, 4.195, 4.205 ) ) ) 	erg = -3;

		else if ( pos_3_12 > pos_3_6 ) 	erg = -4;

		return {
			[`V_Input_${varNam}_1_Pos`]: this.ticks[0] ? Math.round( this.ticks[0].value*1000 ) : 0,
			[`V_Input_${varNam}_1_Nr`]: this.ticks[0] ? +( this.ticks[0].labelObj.value ) : 0,
			[`V_Input_${varNam}_2_Pos`]: this.ticks[1] ? Math.round( this.ticks[1].value*1000 ) : 0,
			[`V_Input_${varNam}_2_Nr`]: this.ticks[1] ? +( this.ticks[1].labelObj.value ) : 0,
			[`V_Score_${varNam}`]: erg,
		}
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
		{ act:'moveLin', x: '3.47s', y: '0s',	 	duration:400,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:0,		cursor:'demo', },
		{ act:'moveLin', x: '3.47s', y: '60s',	 	duration:400,	pause:200,		cursor:'demo', },
		{ 					 										pause:400,		cursor:'demo_click', },
		{ event:'click', 											pause:400,							 },
		{ textInput:'1',											pause:150, 							 },
		{ textInput:'2',											pause:150, 							 },
		{ textInput:',',											pause:150, 							 },
		{ textInput:'3',											pause:150, 							 },
		{ textInput:'4',											pause:150, 							 },
		{ act:'moveLin', x: '3.55s', y: '60s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ event:'click', 											pause:200,		cursor:'demo_click', },
		{ 				 											pause:300,		cursor:'demo', },

		{ act:'moveLin', x: '3.734s', y: '0s',	 	duration:400,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:0,		cursor:'demo', },
		{ act:'moveLin', x: '3.734s', y: '60s',	 	duration:400,	pause:200,		cursor:'demo', },
		{ 					 										pause:400,		cursor:'demo_click', },
		{ event:'click', 											pause:400,							 },
		{ textInput:'8',											pause:150, 							 },
		{ textInput:'8',											pause:150, 							 },
		{ textInput:',',											pause:150, 							 },
		{ textInput:'9',											pause:150, 							 },
		{ textInput:'9',											pause:150, 							 },
		{ act:'moveLin', x: '3.85s', y: '60s',	 	duration:200,	pause:200,		cursor:'demo', },
		{ event:'click', 											pause:200,		cursor:'demo_click', },
		{ 				 											pause:300,		cursor:'demo', },

		{ act:'moveLin', x: '3.47s', y: '0s',	 	duration:400,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: '3.33s', y: '0s',	 	duration:300,	pause:200,		cursor:'demo_click', },
		{ act:'moveLin', x: '3.365s', y: '0s',	 	duration:300,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:300,		cursor:'demo', },

		{ act:'moveLin', x: '3.734s', y: '0s',	 	duration:400,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: '3.93s', y: '0s',	 	duration:300,	pause:200,		cursor:'demo_click', },
		{ act:'moveLin', x: '3.524s', y: '0s',	 	duration:300,	pause:200,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:600,		cursor:'demo', },
	],
})

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

