import './main.css'
import './textareaInserts_2cols.css'

import { baseInits } from '../../lib/src/baseInits'
import { textareaInserts, toolbarFraction, toolbarMathOperators, toolbarMathOperatorsFraction, toolbarMathOperatorsFractionComparison } from '../../lib/src/textareaInserts'

const toolbarCellWidth = 30;

const base = new baseInits();
const ti = new textareaInserts( '#container', {

	toolbarDirection: 'row',
	divStyles: {
		width: `${window.innerWidth-2*toolbarCellWidth}px`,
		height: `${window.innerHeight}px`,
	},

	toolbarContainerStyles: {
		// left: `${window.innerWidth-6*toolbarCellWidth-17}px`,
		// top: `${window.innerHeight-toolbarCellWidth-17}px`,
		width: `${2*toolbarCellWidth}px`,
		height: `${2*toolbarCellWidth}px`,
		'flex-wrap': 'wrap',
	},

	toolbarCellStyles: {
		width: `${toolbarCellWidth}px`,
		height: `${toolbarCellWidth}px`,
	},


/// #if __param1 == 'toolbarFraction'
	toolbar: toolbarFraction,
/// #elif __param1 == 'toolbarMathOperators'
	toolbar: toolbarMathOperators,
/// #elif __param1 == 'toolbarMathOperatorsFraction'
	toolbar: toolbarMathOperatorsFraction,
/// #elif __param1 == 'toolbarMathOperatorsFractionComparison'
	toolbar: toolbarMathOperatorsFractionComparison,
/// #else
	toolbar: toolbarMathOperatorsFraction,
/// #endif


/// #if __hasFsmVariableName
	FSMVariableName: __fsmVariableName,
/// #endif
/// #if __hasScoreVariableName
	scoreVariableName: __scoreVariableName,
/// #endif

/// #if __item == 'instruktion'
	scoreDef: undefined,
/// #endif
}, base );

window.getState = ti.getState.bind(ti);
window.setState = ti.setState.bind(ti);
