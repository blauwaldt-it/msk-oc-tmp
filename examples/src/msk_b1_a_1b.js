import './main.css'

import { baseInits } from '../../lib/src/baseInits'
import { rectArea_freePaintMarker } from '../../lib/src/rectArea'

const x = 35;
const y = 25;
const width = 600;
const height = 200;
const FSMVariableName = "1b";
const rectStrokeWidth = 3;

const base = new baseInits( {
	container: 'container',
} );

const area = new rectArea_freePaintMarker( base, {

	x, y,
	width, height,
	frameWidth: rectStrokeWidth,

	paintLines: {
		brush: {
			strokeWidth: 4,
		}
	},

	freePaintBrushClipFunc (ctx) {
		ctx.rect( 0, 0, x+width+25, Math.min( y+height+50, base.height ) );
	},

	modeIconBarDef: {
		x: x+width+32, y,
		width: 32, height: 32,
		spacing: 0,
		framePadding: 2,
	},

	FSMVariableName,
} );

window.getState = area.getState.bind(area);
window.setState = area.setState.bind(area);
