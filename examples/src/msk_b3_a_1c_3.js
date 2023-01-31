import './main.css'

import { baseInits } from '../../lib/src/baseInits'
import { bars_freePaint } from '../../lib/src/bars'

const varNam = "1c_3";

const base = new baseInits( { container: 'container' } );
const width = base.width;
const height = base.height;

const barX = 40;
const barHeight = 70;
const barWidth = 750;
const barY = (height-barHeight)/2;

const iconWidth = 20.5;
const iconPadding = 1;

const io = new bars_freePaint( base, {

	bars: [
		{
			x: barX, y: barY,
			width: barWidth, height: barHeight,
		},
	],

	extraLines: [
		{
			points: [ barX, barY+barHeight/2, barX+barWidth, barY+barHeight/2 ],
			strokeWidth: 1,
			stroke: '#404040',
		},
	],

	modeIconBarDef: {
		x: 0, y: (height-4*(iconWidth+2*iconPadding+2))/2,
		width: iconWidth, height: iconWidth,
		framePadding: iconPadding,
	},

	FSMVariableName: varNam,
})
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

