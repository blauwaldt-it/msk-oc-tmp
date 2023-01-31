import './main.css'

import { baseInits } from '../../lib/src/baseInits'
import { numberLineWithArcs } from '../../lib/src/numberLineWithArcs'

const varNam = "1b_1";
const inputRegexp = '^(\\d{0,5}|\\d{4}[,.]\\d{0,1}|\\d{3}[,.]\\d{0,2}|\\d{2}[,.]\\d{0,3}|\\d{1}[,.]\\d{0,4})$';
const tickLabelWidth = 75;

const base = new baseInits( { container: 'container' } );
const width = base.width-tickLabelWidth;

const io = new numberLineWithArcs( base, {

	numberLine: {
		type: 'none',
		y: 55,
		x: (base.width-width)/2,
		width: width,
		valFrom: 0, valTo: 100,
	},

	arcWidth: 2,

	newArcDefaults: {
		label: '',
	},

	arcLabelDistance: 2,
	newArcLabelDefaults: {
		width: 55,
		height: 18,
		frameWidth: 1,
		inputRegexp,
	},

	tickLabelDistance: 10,
	tickFrameWidth: 1,

	newTickLabelDefaults: {
		label: "",
		width: tickLabelWidth,
		fontSize: 20,
		inputRegexp,
	},

	FSMVariableName: varNam,
});
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

