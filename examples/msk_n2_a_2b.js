import './main.css'

import { baseInits } from '../libs/baseInits'
import { numberLineWithAnnotations } from '../libs/numberLineWithAnnotations'

import { isBetween } from '../libs/common'

const varNam = "2b";

const base = new baseInits( { container: 'container' } );

const width = 790;
const io = new numberLineWithAnnotations( base, {

	numberLine: {
		type: 'none',
		y: 30,
		x: (base.width-width)/2,
		width: width,
		valFrom: 0, valTo: 100,
	},

	annotations: [
		{ y: 60, toValue: 0, text: '0', annotationTickHeightBottom: 0, toValueReadonly: 1, textReadonly: 1, },
		{ y: 60, toValue: 100, text: '100', annotationTickHeightBottom: 0, toValueReadonly: 1, textReadonly: 1, },
		{ y: 95, toValue: 10, xval: 25, text: '10', annotationTickHeightBottom: 15, toValueReadonly: 1, textReadonly: 1, },
		{ y: 83, xval: 37, text: '20', annotationTickHeightBottom: 15, textReadonly: 1, },
		{ y: 88, xval: 47, text: '45', annotationTickHeightBottom: 15, textReadonly: 1, },
		{ y: 80, xval: 58, text: '54', annotationTickHeightBottom: 15, textReadonly: 1, },
		{ y: 88, xval: 70, text: '64', annotationTickHeightBottom: 15, textReadonly: 1, },
		{ y: 83, xval: 82, text: '99', annotationTickHeightBottom: 15, textReadonly: 1, },
	],

	statusVarDef: function () {
		const res = {
			[`V_Status_${varNam}_1`]: +( this.annotations[3].toValue !== this.initData[3].toValue ),
			[`V_Status_${varNam}_2`]: +( this.annotations[4].toValue !== this.initData[4].toValue ),
			[`V_Status_${varNam}_3`]: +( this.annotations[5].toValue !== this.initData[5].toValue ),
			[`V_Status_${varNam}_4`]: +( this.annotations[6].toValue !== this.initData[6].toValue ),
			[`V_Status_${varNam}_5`]: +( this.annotations[7].toValue !== this.initData[7].toValue ),
		}
		res[`V_Status_${varNam}`] = +Object.values(res).every( v => v>0 );
		return res;
	},

	FSMVariableName: varNam,
	scoreDef: function () {

		const vals = {};
		this.annotations.slice(3).forEach( v => vals[ +v.text ] = v.toValue );
		const diffs_10_20 = ( +vals[20] - +this.annotations[2].toValue );
		const diffs_20_45 = ( +vals[45] - +vals[20] );
		const diffs_45_54 = ( +vals[54] - +vals[45] );
		const diffs_54_64 = ( +vals[64] - +vals[54] );
		const diffs_64_99 = ( +vals[99] - +vals[64] );

		let erg = -2;

		if (	isBetween( +vals[20], 15, 25 ) &&
				isBetween( +vals[45], 40, 50 ) &&
				isBetween( +vals[54], 49, 59 ) &&
				isBetween( +vals[64], 59, 69 ) &&
				isBetween( +vals[99], 95, 100 ) &&
				isBetween( diffs_10_20, 6, 15 ) &&
				isBetween( diffs_20_45, 20, 30 ) &&
				isBetween( diffs_45_54, 5, 14 ) &&
				isBetween( diffs_54_64, 6, 15 ) ) 	erg = 1;

		const inp_vals = Object.values( vals );
		if ( inp_vals.every( v => v===null ) ) 	erg = -1;

		// else if ( inp_vals.some( v => v===null ) ) 	erg = -2;

		else if (	isBetween( diffs_10_20, 6, 15 ) &&
				isBetween( diffs_20_45, 6, 15 ) &&
				isBetween( diffs_45_54, 6, 15 ) &&
				isBetween( diffs_54_64, 6, 15 ) &&
				isBetween( diffs_64_99, 6, 15 ) ) 	erg = -3;

		else if (	diffs_10_20 < 0 ||
				diffs_20_45 < 0 ||
				diffs_45_54 < 0 ||
				diffs_54_64 < 0 ||
				diffs_64_99 < 0 ) 	erg = -4;

		else if ( !isBetween( vals[99], 95, 100 ) ) 	erg = -5;

		return {
			[`V_Input_${varNam}_1`]: +( Math.round( this.annotations[3].toValue ) ),
			[`V_Input_${varNam}_2`]: +( Math.round( this.annotations[4].toValue ) ),
			[`V_Input_${varNam}_3`]: +( Math.round( this.annotations[5].toValue ) ),
			[`V_Input_${varNam}_4`]: +( Math.round( this.annotations[6].toValue ) ),
			[`V_Input_${varNam}_5`]: +( Math.round( this.annotations[7].toValue ) ),
			[`V_Score_${varNam}`]: erg,
		}
	},
});
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

