import './main.css'

import { baseInits } from '../lib/baseInits'
import { barPlot } from '../lib/barPlot'
import { isBetween } from '../lib/common';

const base = new baseInits( { container: 'container' } );

const originX = 70;
const originY = base.height - 40;

const roLabel = {
	frameWidth: 0,
	readonly: 1,
}

const roBar = {
	fill: 'black',
	stroke: 'black',
	readonly: 1,
}

const io = new barPlot( base, {

	origin: {
		x: originX,	y: originY,
	},

	titleObj: {
		value: 'Lieblingssportarten in Klasse 5',
		...roLabel,
	},

	yAxis: {
		height: originY-55,
		maxVal: 18,
		lineInc: 2,
		tickInc: 2,
		labelInc: 2,
		axisLabelObj: {
			value: 'Anzahl der Kinder',
			distance: 10,
			...roLabel
		},
		labelObjs: [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ].map( y => ({
			value: y.toString(),
		})),
	},
	defaultYLabelOpts: {
		width: 20,
		...roLabel,
	},

	xAxis: {
		width: base.width-originX-5,
	},

	bars: [
		{
			value: 16,
			...roBar,
		},{
			value: 13,
			...roBar,
			labelObj: {
				value: 'Fußball',
				...roLabel,
			},
		},{
			labelObj: {
				value: 'Schwimmen',
				...roLabel,
			},
		},{
			labelObj: {
				value: 'Judo',
				...roLabel,
			},
		},{
			value: 5,
			...roBar,
		},{
			value: 4,
			labelObj: {
				value: 'Sonstiges',
				...roLabel,
			},
			...roBar,
		},
	],

	statusVarDef: function () {
		const bval3 = ( this.bars[2].value ?? 0);
		const bval4 = ( this.bars[3].value ?? 0);
		const btext1 =this. bars[0].labelObj.value;
		const btext5 = this.bars[4].labelObj.value;

		return {
			[`V_Status_${__fsmVariableName}`]: +( bval3!==0 && bval4!==0 && btext1!=='' && btext5!=='' ),
		}
	},

	scoreDef: function () {
		let erg;

		const bval3 = ( this.bars[2].value ?? 0);
		const bval4 = ( this.bars[3].value ?? 0);
		const btext1 =this. bars[0].labelObj.value;
		const btext5 = this.bars[4].labelObj.value;

		if ( isBetween( bval3, 11.85, 12.15 ) &&
			isBetween( bval4, 6.85, 7.15 ) &&
			btext1 == 'Handball' &&
			btext5 == 'Reiten' )			erg = 1;

		else if ( bval3===0 && bval4===0 && btext1==='' && btext5==='' )	erg = -1;

		else if ( isBetween( bval4, 13.85, 14.15 ) ) 	erg = -3;

		else if ( isBetween( bval4, 5.85, 6.15 ) || isBetween( bval4, 7.85, 8.15 )) 	erg = -4;

		else if ( bval3===0 && bval4===0 )		erg = -5;

		else if ( btext1==='' && btext5==='' )	erg = -6;

		else erg = -2;

		return {
			[`V_Input_${__fsmVariableName}_1`]: Math.round( bval3*100 ),
			[`V_Input_${__fsmVariableName}_2`]: Math.round( bval4*100 ),
			[`V_Input_${__fsmVariableName}_3`]: btext1,
			[`V_Input_${__fsmVariableName}_4`]: btext5,
			[`V_Score_${__fsmVariableName}_1`]: erg,
		}
	}
});

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);
