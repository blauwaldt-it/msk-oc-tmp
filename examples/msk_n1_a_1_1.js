import './main.css'

import { baseInits } from '../lib/baseInits'
import { numbersByPictures } from '../lib/numbersByPictures'

const base = new baseInits( { container: 'container' } );

const iconX = 7;
const x = iconX+22+14;
const io = new numbersByPictures ( base, {
	x: x, y: (base.height-60-18)/2+18, width: base.width-x,
	pics: {
		width: 60,
	},
	data: [
		{ c: 1 },
		{ c: 1 },
		{ r: 1 },
		{ b: 7, d: 8 },
	],
	readonly: 1,
})

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

