import './main.css'
import './textareaInserts_2cols.css'

import { baseInits } from '../../lib/src/baseInits'
import { textareaInserts, toolbarMathOperatorsFraction } from '../../lib/src/textareaInserts'
import { rectArea_freePaint } from '../../lib/src/rectArea'

///////////////////////////////////////

const FSMVariableName = __fsmVariableName;
const combinedStatus = [ 0, 0 ];
const combinedStatusName = `V_Status_${FSMVariableName}_Ext`;

const toolbarCellWidth = 30;

const ttBase = new baseInits();
const ttWidth = window.innerWidth/2;

const ti = new textareaInserts( '#tt', {

	toolbarDirection: 'row',
	divStyles: {
		width: `${ttWidth-2*toolbarCellWidth}px`,
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

	toolbar: toolbarMathOperatorsFraction,

	FSMVariableName,
	statusVarDef () {
		combinedStatus[0] = +(!!this.getDefaultChangeState());
		return {
			// [this.FSMVariableName]: combinedStatus[0],
			[combinedStatusName]: Math.max( ...combinedStatus ),
		}
	},
}, ttBase )

///////////////////////////////////////

const base = new baseInits( {
	container: 'container',
	width: ttWidth,
	fsm: ttBase.fsm,
} );

const area = new rectArea_freePaint( base, {

	x: 0, y: 0,
	width: ttWidth-10, height: base.height-1,

	modeIconBarDef: {
		x: ttWidth-10-32-5, y: 0,
		width: 32, height: 32,
		spacing: 0,
	},

	// FSMVariableName: `${FSMVariableName}_draw`,
	statusVarDef () {
			combinedStatus[1] = +(!!this.getDefaultChangeState());
			return {
				// [this.FSMVariableName]: combinedStatus[1],
				[combinedStatusName]: Math.max( ...combinedStatus ),
			}
		},
} );

///////////////////////////////////////

window.getState = () => {
	const state = {
		text: JSON.parse( ti.getState() ),
		pic: JSON.parse( area.getState() ),
	}
	return JSON.stringify( state );
}

window.setState = (state) => {

	try {
		const load = JSON.parse(state);
		if ( load.text ) {
			ti.setState( JSON.stringify(load.text) );
		}
		if ( load.pic ) {
			area.setState( JSON.stringify(load.pic) );
		}
	} catch (e) {
		console.error(e);
	}
}
