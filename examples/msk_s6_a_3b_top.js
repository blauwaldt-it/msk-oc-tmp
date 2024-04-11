import './main.css'

import { baseInits } from '../libs/baseInits'
import { barSlider_freePaint } from '../libs/barSlider'

const varNam = "3b_bar";

const base = new baseInits( { container: 'container' } );
const width = base.width;
const height = base.height;

const iconWidth = 18;
const iconPadding = 1;

const barX = 50;
const barHeight = 40;
const barWidth = width-barX-20;
const barY = (height-barHeight)/2;

const io = new barSlider_freePaint( base, {

	x: barX, y: barY,
	width: barWidth, height: barHeight,
	markedFillColor: '#6666ff',
	sliderHeight: barHeight+20,

	modeIconBarDef: {
		x: 0, y: (height-3*(iconWidth+2*iconPadding+2))/2,
		width: iconWidth, height: iconWidth,
		framePadding: iconPadding,
	},

	FSMVariableName: varNam,
})
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

