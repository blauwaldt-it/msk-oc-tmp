import './main.css'

import { baseInits } from '../libs/baseInits'
import { numberLineWithAnnotations } from '../libs/numberLineWithAnnotations'

import { isBetween } from '../libs/common'

const varNam = "1a";
const tol = 0.005;

const base = new baseInits( { container: 'container' } );

const width = 790;
const io = new numberLineWithAnnotations( base, {

	numberLine: {
		type: 'ticks',
		y: 40,
		x: (base.width-width-30)/2,
		width: width,
		valFrom: -0.02, valTo: 1.03,
		minTicks: { vals: 0.01, min: 0, max: null },
		midTicks: { vals: 0.05, min: 0, max: null },
		majTicks: { vals: 0.1, min: 0, max: null },
		labels: [ 0, 1 ],
		arrowDist: 20,
	},

	annotations: [
		{ y: 110, xval: 0.15, text: '1 Zehntel', textReadonly: 1, width: 140, },
		{ y: 110, xval: 0.420, text: '8 Hundertstel', textReadonly: 1, width: 160, },
		{ y: 110, xval: 0.75, text: '6 Zehntel 7 Hundertstel', textReadonly: 1, width: 250, },
	],

	statusVarDef: function () {
		const res = {
			[`V_Status_${varNam}_1`]: +( this.annotations[0].toValue !== null ),
			[`V_Status_${varNam}_2`]: +( this.annotations[1].toValue !== null ),
			[`V_Status_${varNam}_3`]: +( this.annotations[2].toValue !== null ),
		}
		return {
			[`V_Status_${varNam}`]: +Object.values(res).every( v => v>0 ),
		}
	},

	FSMVariableName: varNam,
	scoreDef: function () {

		const vals = this.annotations.map( v => v.toValue === null ? null : +v.toValue );
		let erg = -2;

		if (	isBetween( vals[0], 0.1-tol, 0.1+tol ) &&
				isBetween( vals[1], 0.08-tol, 0.08+tol ) &&
				isBetween( vals[2], 0.67-tol, 0.67+tol ) ) 	erg = 1;

		else if ( vals.every( v => v===null ) ) erg = -1;

		else if ( vals.some( v => v===null ) ) erg = -2;

		else if (	isBetween( vals[0], 0.01-tol, 0.01+tol ) ||
				isBetween( vals[1], 0.8-tol, 0.8+tol ) ||
				isBetween( vals[2], 0.76-tol, 0.76+tol ) ) erg = -3;

		else if (	isBetween( vals[2], 0.7-tol, 0.7+tol ) ||
				isBetween( vals[2], 0.6-tol, 0.6+tol ) ) erg = -4;

		return {
			[`V_Input_${varNam}_1`]: Math.round( this.annotations[0].toValue*1000 ),
			[`V_Input_${varNam}_2`]: Math.round( this.annotations[1].toValue*1000 ),
			[`V_Input_${varNam}_3`]: Math.round( this.annotations[2].toValue*1000 ),
			[`V_Score_${varNam}`]: erg,
		}
	},
});
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

