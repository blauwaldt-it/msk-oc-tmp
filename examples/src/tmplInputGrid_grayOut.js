import './main.css'

import { baseInits } from '../../lib/src/baseInits'
/// #if __param1 == 'paint'
import { inputGrid_freePaint_InsertButtons_grayOut } from '../../lib/src/inputGrid'
/// #else
import { inputGrid_InsertButtons } from '../../lib/src/inputGrid'
/// #endif

const cell = {
	width: 20,
	height: 20,
};
const toolbarSpace = 10;

const switchWidth = 30;
const switchHeight = 2*cell.height*1.5;

const x = 0;
const y = 0;

const base = new baseInits( { container: 'container' } );
const width = base.width - Math.max( 2*cell.width*1.5, switchWidth ) - toolbarSpace - x;
const height = base.height;
const cols = Math.floor( width / cell.width );
const rows = Math.floor( height / cell.height );



const insertTexts = [
/// #if __param3 == 'percent_euro'
	[ '€', { extraSpace: cell.height },'<','+','⋅','=' ],
	[ '%', { extraSpace: cell.height },'>','-','∶', ],
/// #else
	[ '<','+','⋅','=' ],
	[ '>','-','∶', ],
/// #endif
];


const iconBarX = x + cols*cell.width + toolbarSpace-1;
/// #if __param2 == '-'
const insertButtonsY = 0;
/// #elif __param2 != ''
const insertButtonsY = ( __param2.length + 1 ) * 1.5*cell.height;
/// #else
const insertButtonsY = 5 * 1.5*cell.height;
/// #endif


/// #if __param1 == 'paint'
const ig = new inputGrid_freePaint_InsertButtons_grayOut( base, {
/// #else
const ig = new inputGrid_InsertButtons( base, {
/// #endif
	x, y,
	cell,
	grid: {
		cols,
		rows,
	},

/// #if __param2 == '-'
	textModeBarDefs: null,
/// #elif __param2 != ''
	textModeBarDefs: {
		x: iconBarX,
		y: 0,
		iconDefs: __param2,
	},
/// #else
	textModeBarDefs: {
		x: iconBarX,
		y: 0,
	},
/// #endif

	insertIconDefs: [{
		x: iconBarX,
		y: insertButtonsY,
		texts: insertTexts[0],
	},{
		x: iconBarX + cell.width*1.5,
		y: insertButtonsY,
		texts: insertTexts[1],
	}],

/// #if __param1 == 'paint'
	modeIconBarDef: {
		x: iconBarX,
		y: insertButtonsY + ( Math.max( insertTexts[0].length, insertTexts[1].length )+1 ) * 1.5*cell.height,
	},
/// #endif

/// #if __hasFsmVariableName
	FSMVariableName: __fsmVariableName,
/// #endif
/// #if __hasScoreVariableName
	scoreVariableName: __scoreVariableName,
/// #endif
});

window.getState = ig.getState.bind(ig);
window.setState = ig.setState.bind(ig);
