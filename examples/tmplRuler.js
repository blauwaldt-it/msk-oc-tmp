import './main.css'

import { baseInits } from '../lib/baseInits'
import { ruler } from '../lib/ruler';

const base = new baseInits( { container: 'container' } );

const io = new ruler( base, {

	x: 10, y: 130,
	width: 400,
	height: 50,
	rotation: ( Math.random()<0.5 ? -1 : 1 )*( 5 + Math.random()*15 ),

	extraLines: [
/// #if __itemFN == 'msk_s1_a_1a'
		{ x: 100, y: 50, len: 7 },
/// #elif __itemFN == 'msk_s1_a_2b_top'
		{ x: 50, y: 50, len: 4 },
		{ x: 250, y: 50, len: 3 },
/// #endif
	],

});

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);
