import './main.css'

import { baseInits } from '../libs/baseInits'
import { numberLineWithAnnotations } from '../libs/numberLineWithAnnotations'

const varNam = "1b";

const base = new baseInits( { container: 'container' } );

const width = 790;
const io = new numberLineWithAnnotations( base, {

	numberLine: {
		type: 'chain',
		y: 60,
		x: (base.width-width)/2,
		width: width,
		valFrom: 0, valTo: 100,
	},

	annotations: [
		{ y: 120, toValue: 0, text: '0', toValueReadonly: 1, textReadonly: 1, },
		{ y: 160, xval: 15, toValue: 13, text: '13', toValueReadonly: 1, textReadonly: 1, },
		{ y: 120, toValue: 100, text: '100', toValueReadonly: 1, textReadonly: 1, },
		{ y: 160, xval: 28, text: '31', textReadonly: 1, },
		{ y: 160, xval: 42, text: '44', textReadonly: 1, },
		{ y: 160, xval: 57, text: '51', textReadonly: 1, },
		{ y: 160, xval: 72, text: '66', textReadonly: 1, },
		{ y: 160, xval: 86, text: '98', textReadonly: 1, },
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

	scoreDef: function () {
		return {
			[`V_Input_${varNam}_1`]: this.annotations[3].toValue,
			[`V_Input_${varNam}_2`]: this.annotations[4].toValue,
			[`V_Input_${varNam}_3`]: this.annotations[5].toValue,
			[`V_Input_${varNam}_4`]: this.annotations[6].toValue,
			[`V_Input_${varNam}_5`]: this.annotations[7].toValue,
		}
	},
});
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

