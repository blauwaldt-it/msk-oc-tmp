import './main.css'

import { baseInits } from '../../lib/src/baseInits'
/// #if __param1 == 'paint'
import { inputGrid_freePaint_InsertButtons } from '../../lib/src/inputGrid'
/// #else
import { inputGrid_InsertButtons } from '../../lib/src/inputGrid'
/// #endif

const cell = {
	width: 20,
	height: 20,
};
const toolbarSpace = 10;

/// #if __param1 == 'paint' || __param2 != '-'
const x = cell.width*1.5 + toolbarSpace;
/// #else
const x = 0;
/// #endif
const y = 0;

const base = new baseInits( { container: 'container' } );
const width = base.width - 2*cell.width*1.5 - toolbarSpace - x;
const height = base.height;
const cols = Math.floor( width / cell.width );
const rows = Math.floor( height / cell.height );

/// #if __param1 == 'paint'
const ig = new inputGrid_freePaint_InsertButtons( base, {
/// #else
const ig = new inputGrid_InsertButtons( base, {
/// #endif
	x, y,
	grid: {
		cols,
		rows,
	},

	insertIconDefs: [{
		x: x + cols*cell.width + toolbarSpace-1,
/// #if __param3 == 'percent_euro'
		texts: [ '€', { extraSpace: cell.height },'<','+','⋅','=' ],
/// #else
		texts: [ '<','+','⋅','=' ],
/// #endif
	},{
		x: x + cols*cell.width + cell.width*1.5 + toolbarSpace-1,
/// #if __param3 == 'percent_euro'
		texts: [ '%', { extraSpace: cell.height },'>','-','∶', ],
/// #else
		texts: [ '>','-','∶', ],
/// #endif
	}],

/// #if __param2 == '-'
	textModeBarDefs: null,
/// #elif __param2 != ''
	textModeBarDefs: {
		iconDefs: __param2,
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
