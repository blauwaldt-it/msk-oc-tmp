import './main.css'

import { baseInits } from '../libs/baseInits'
import { filledBar } from '../libs/filledBar'

const varNam = "1c_2";

const base = new baseInits( { container: 'container' } );
const width = base.width;
const height = base.height;

const barHeight = 50;
const barWidth = 850;

const io = new filledBar( base, {

	x: (width-barWidth)/2,
	y: (height-barHeight)/2,

	width: barWidth,
	height: barHeight,

	valFrom: 0,
	valTo: 10,

	FSMVariableName: varNam,
	statusVarDef: function () {
		return {
			[`V_Status_${varNam}_bar`]: +this.getDefaultChangeState(),
		}
	},
});
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

