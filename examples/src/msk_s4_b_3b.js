import './main.css'

import { baseInits } from '../../lib/src/baseInits'
import { barPlot } from '../../lib/src/barPlot'

const base = new baseInits( { container: 'container' } );

const originX = 100;
const originY = base.height - 40;
const xaWidth = base.width-originX-5;

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
        frameWidth: 1,
        width: xaWidth*0.6,
        x: originX+xaWidth*0.2,
        distance: 20,
    },

    yAxis: {
        height: originY-55,
        maxVal: 10,
        lineInc: 2,
        tickInc: 2,
        labelInc: 2,
        axisLabelObj: {
            frameWidth: 1,
            distance: 15,
        }
    },
    defaultYLabelOpts: {
        frameWidth: 1,
        inputRegexp: "^[0-9]{0,3}$",
        align: 'center',
    },

    xAxis: {
        width: xaWidth,
    },

    bars: [
        {},
        {},
        {},
        {},
    ],

    FSMVariableName: __fsmVariableName,

    statusVarDef: function () {
        return {
            [`V_Status_${__fsmVariableName}`]: +( this.titleObj.value &&
                                        this.yAxis.axisLabelObj.value &&
                                        this.yAxis.labelObjs.every( l => l.value ) &&
                                        this.bars.every( b => b.value && b.labelObj.value ) ),
            [`V_Status_${__fsmVariableName}_S`]: +( this.titleObj.value ||
                                        this.yAxis.axisLabelObj.value ||
                                        this.yAxis.labelObjs.some( l => l.value ) ||
                                        this.bars.some( b => b.value || b.labelObj.value ) ),
        }
	},

	scoreDef: function () {
		return {
			[`V_Input_${__fsmVariableName}_1`]: this.titleObj.value,
			[`V_Input_${__fsmVariableName}_2`]: this.yAxis.axisLabelObj.value,
			[`V_Input_${__fsmVariableName}_3`]: +( this.yAxis.labelObjs[0].value ),
			[`V_Input_${__fsmVariableName}_4`]: +( this.yAxis.labelObjs[1].value ),
			[`V_Input_${__fsmVariableName}_5`]: +( this.yAxis.labelObjs[2].value ),
			[`V_Input_${__fsmVariableName}_6`]: +( this.yAxis.labelObjs[3].value ),
			[`V_Input_${__fsmVariableName}_7`]: +( this.yAxis.labelObjs[4].value ),
			[`V_Input_${__fsmVariableName}_8`]: +( this.yAxis.labelObjs[5].value ),
			[`V_Input_${__fsmVariableName}_9`]: this.bars[0].labelObj.value,
			[`V_Input_${__fsmVariableName}_10`]: this.bars[1].labelObj.value,
			[`V_Input_${__fsmVariableName}_11`]: this.bars[2].labelObj.value,
			[`V_Input_${__fsmVariableName}_12`]: this.bars[3].labelObj.value,
			[`V_Input_${__fsmVariableName}_13`]: Math.round( ( this.bars[0].value ?? 0 ) * 100 ),
			[`V_Input_${__fsmVariableName}_14`]: Math.round( ( this.bars[1].value ?? 0 ) * 100 ),
			[`V_Input_${__fsmVariableName}_15`]: Math.round( ( this.bars[2].value ?? 0 ) * 100 ),
			[`V_Input_${__fsmVariableName}_16`]: Math.round( ( this.bars[3].value ?? 0 ) * 100 ),
		}
	}

});

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);
