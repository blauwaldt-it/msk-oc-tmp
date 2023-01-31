import './main.css'

import { baseInits } from '../../lib/src/baseInits'
import { stampImages } from '../../lib/src/stampImages'
import { demoAni } from '../../lib/src/demoAni'

import child from '../../lib/img/child.png'
import dot from '../../lib/img/dot.png'

import demo_cursor from '../../lib/img/demo_cursor.png'
import demo_cursor_click from '../../lib/img/demo_cursor_click.png'

const base = new baseInits( { container: 'container' } );

const iconBarX = base.width-38;
const iconBarY = 2;
const io = new stampImages( base, {

	x: 0, y: 0,
	width: base.width, height: base.height,
	iconBarX, iconBarY,

	stamps: [ child, dot ],

	FSMVariableName: '1b',
} );

const iconX = iconBarX + 16;
const iconHeight = 32+7;
const iconY = [ iconBarY + 16, iconBarY + 16 + iconHeight, iconBarY + 16 + iconHeight*2, iconBarY + 16 + iconHeight*3 ];
const sx = base.width*2/3;
const sy = -20;

const startDemoAni = !( new URL( window.location.href ) ).searchParams.has('noDemoAni');

const ani = startDemoAni && new demoAni( base.stage, {
	repeats: 2,
	beginDelay: 300,

	// val2x: barSlid.val2x.bind(barSlid),
	// val2y: (ys) => barSlid.y+barSlid.height/2+ys,
	getState: io.getState.bind(io),
	setState: io.setState.bind(io),

	cursor: {
		demo: {	cursor: demo_cursor, cursorOfX: 8, cursorOfY: 3, },
		demo_click: { cursor: demo_cursor_click, cursorOfX: 21, cursorOfY: 18, }
	},

	ani: [
		{ act:'moveLin', x: iconX, y: iconY[0], 	duration:400,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:300,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+100, y: sy+100, 	 	duration:200,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:200,		cursor:'demo', },

		{ act:'moveLin', x: iconX, y: iconY[0], 	duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:100,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+125, y: sy+120, 	 	duration:200,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:100,		cursor:'demo', },

		{ act:'moveLin', x: iconX, y: iconY[0], 	duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:100,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+160, y: sy+95, 	 	duration:200,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:100,		cursor:'demo', },

		{ act:'moveLin', x: iconX, y: iconY[2], 	duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:300,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:200,		cursor:'demo', },
		{ act:'moveLin', x: sx+80, y: sy+70, 	 	duration:300,	pause:100,		cursor:'demo', },
		{ event:'mousedown', 										pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+140, y: sy+66,  		duration:200,	pause:60,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+183, y: sy+75,  		duration:200,	pause:60,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+178, y: sy+140, 		duration:200,	pause:60,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+110, y: sy+160, 		duration:200,	pause:60,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+85, y: sy+135,  		duration:200,	pause:60,		cursor:'demo_click', },
		{ act:'moveLin', x: sx+87, y: sy+65, 	 	duration:200,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:400,		cursor:'demo', },

		{ act:'moveLin', x:iconX, y:iconY[3], 		duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 										pause:300,		cursor:'demo_click', },
		{ event:'mouseup', 											pause:300,		cursor:'demo', },
	],
})

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

