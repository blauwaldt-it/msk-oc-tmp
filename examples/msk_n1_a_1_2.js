import './main.css'

import { baseInits } from '../lib/baseInits'
import { numbersByPictures } from '../lib/numbersByPictures'

const varNam = "1_2";

const base = new baseInits( { container: 'container' } );

const iconX = 7;
const x = iconX+22+14;
const io = new numbersByPictures ( base, {

	x: x, y: (base.height-60-18)/2+18, width: base.width-x,
	iconBar: {
		x: iconX, y: (base.height-4*22-3*2)/2,
		width: 22, height: 22,
		frameFill: '#e5e5e5',
	},
	pics: {
		width: 60,
	},

	FSMVariableName: varNam,
	scoreDef: function () {
		return {
			[`V_Input_${varNam}_T`]: this.data.reduce( (acc, cur) => acc += cur.c || 0, 0 ),
			[`V_Input_${varNam}_H`]: this.data.reduce( (acc, cur) => acc += cur.r || 0, 0 ),
			[`V_Input_${varNam}_Z`]: this.data.reduce( (acc, cur) => acc += cur.b || 0, 0 ),
			[`V_Input_${varNam}_E`]: this.data.reduce( (acc, cur) => acc += cur.d || 0, 0 ),
		}
	},
})

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

