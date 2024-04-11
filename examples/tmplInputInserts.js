import './main.css'

import { baseInits } from '../lib/baseInits'
import { inputInserts } from '../lib/inputInserts'
import { toolbarMathOperators } from '../lib/textareaInserts'

const base = new baseInits();

const ii = new inputInserts( '#container', {

	toolbarCellWidth: 27,	// extra Height for iPad 6th
	inputHeight:25,

	divStyles: {
		width: `${window.innerWidth}px`,
	},

	toolbar: toolbarMathOperators,

	inputRegexp: '^([0-9]*(?:[,.][0-9]*)?|[ +*/:=-]|\u2212|\u22c5|\u2022|\u25cf|\u2236|\u003d)*$',
/// #if __itemFN == 'msk_d4_b_1a' || __itemFN == 'msk_d4_b_2a'
	maxlength: 40,
/// #else
	maxlength: 30,
/// #endif

/// #if __hasFsmVariableName
	FSMVariableName: __fsmVariableName,
/// #endif
/// #if __hasScoreVariableName
	scoreVariableName: __scoreVariableName,
/// #endif

///////////////////////////////////////
/////////////////////////////////////// different scoreDefinitions Batch_1
///////////////////////////////////////

/// #if __itemFN == 'msk_n4_a_1a'
	scoreDef: function () {
		let erg = -2;
		if ( this.isMultRE( [[2,3],[3,2]], 6 ) ) 	erg = 1;
		if ( !this.div.innerHTML.trim().length ) 	erg = -1;
		if ( this.isMultRE( [[2,4],[4,2]], 8 ) ) 	erg = -3;
		if ( this.isMultRE( [[2,2,2]], 8 ) ) 	erg = -4;
		return {
			[`V_Input_${__fsmVariableName}`]: this.extract(),
			[`V_Score_${__fsmVariableName}`]: erg,
		}
},

///////////////////////////////////////

/// #elif __itemFN == 'msk_n4_a_2'
	scoreDef: function () {
		let erg = -2;
		if ( this.isMultRE( [[3,5],[5,3]], 15 ) ) 	erg = 1;
		if ( !this.div.innerHTML.trim().length ) 	erg = -1;
		if ( this.isMultRE( [[3,12],[12,3]], 36 ) ||
				this.isMultRE( [[6,9],[9,6]], 45 ) ) 	erg = -3;
		if ( this.isMultRE( [[3,15],[15,3]], 45 ) ||
				this.isMultRE( [[5,5,5]] ) ||
				this.isMultRE( [[3,3,3,3,3]] ) ) 	erg = -4;
		return {
			[`V_Input_${__fsmVariableName}`]: this.extract(),
			[`V_Score_${__fsmVariableName}`]: erg,
		}
},

/// #endif

///////////////////////////////////////
/////////////////////////////////////// end of scoreDefinition
///////////////////////////////////////

}, base );

window.getState = ii.getState.bind(ii);
window.setState = ii.setState.bind(ii);
