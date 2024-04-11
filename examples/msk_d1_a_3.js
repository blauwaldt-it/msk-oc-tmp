import './main.css'

import { baseInits } from '../libs/baseInits'
import { connectedFrames } from '../libs/connectedFrames'
import { demoAni } from '../libs/demoAni'

import demo_cursor from '../libs/img/demo_cursor.png'
import demo_cursor_click from '../libs/img/demo_cursor_click.png'

const base = new baseInits( { container: 'container' } );

function getConnectorPosTop () {
	return { x: this.x + this.width/2, y: this.y };
}
function getConnectorPosBottom () {
	return { x: this.x + this.width/2, y: this.y+this.height };
}
function canConnectTo (frame) {
	return this.y != frame.y;
}

const width = 885;
const width1 = 230;
const width2 = 100;
const height = 60;

const sp1 = ( width - 3*width1 )/4;
const sp2 = ( width - 4*width2 )/5;

const y1 = 50;
const y2 = 250;

const varNam = "3";

const io = new connectedFrames( base, {

	frames:[
		{ x: sp1, y: y1, text: 'zwischen 2 und 3', height, width: width1, canConnectTo, getConnectorPos: getConnectorPosBottom, readonly: 1, },
		{ x: 2*sp1+width1, y: y1, text: 'zwischen 2,2 und 2,3', height, width: width1, canConnectTo, getConnectorPos: getConnectorPosBottom, readonly: 1, },
		{ x: 3*sp1+2*width1, y: y1, text: 'zwischen 2,22 und 2,23', height, width: width1, canConnectTo, getConnectorPos: getConnectorPosBottom, readonly: 1, },

		{ x: sp2, y: y2, text: '2,9', height, width: width2, canConnectTo, getConnectorPos: getConnectorPosTop, readonly: 1, },
		{ x: 2*sp2+width2, y: y2, text: '2,28', height, width: width2, canConnectTo, getConnectorPos: getConnectorPosTop, readonly: 1, },
		{ x: 3*sp2+2*width2, y: y2, text: '2,8', height, width: width2, canConnectTo, getConnectorPos: getConnectorPosTop, readonly: 1, },
		{ x: 4*sp2+3*width2, y: y2, text: '2,228', height, width: width2, canConnectTo, getConnectorPos: getConnectorPosTop, readonly: 1, },
	],

	connections: [
		{ from: 3, to: 0, readonly: 1, },
	],

	FSMVariableName: varNam,
	scoreDef: function () {

		const to = [];
		for ( let h=0; h<3; h++ ) {
			to[h] = this.connections.filter( c => c.to==h ).map( c => c.from );
		}

		if (	to[0].length==4 && [ 3, 4, 5, 6 ].every( from => to[0].includes(from) ) &&
				to[1].length==2 && [ 4, 6 ].every( from => to[1].includes(from) ) &&
				to[2].length==1 && [ 6 ].every( from => to[2].includes(from) ) ) return 1;

		if ( this.connections.length==1 ) return -1;

		if (	to[0].length==2 && [ 3, 5 ].every( from => to[0].includes(from) ) &&
				to[1].length==1 && [ 4 ].every( from => to[1].includes(from) ) &&
				to[2].length==1 && [ 6 ].every( from => to[2].includes(from) ) ) return -3;

		return -2;
	},
});
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

///////////////////////////////

const cps = io.frames.map( f => f.getConnectorPos() );

const startDemoAni = !( new URL( window.location.href ) ).searchParams.has('noDemoAni');

const ani = startDemoAni && new demoAni( base.stage, {

	repeats: 1,
	beginDelay: 300,

	val2x: v => v,
	val2y: ys => ys,
	getState: io.getState.bind(io),
	setState: io.setState.bind(io),

	cursor: {
		demo: {	cursor: demo_cursor, cursorOfX: 8, cursorOfY: 3, },
		demo_click: { cursor: demo_cursor_click, cursorOfX: 21, cursorOfY: 18, }
	},

	ani: [
		{ act:'moveLin', x: 2*sp2+1.5*width2, y: y2+10, 		duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 									pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: 2*sp1+1.5*width1, y: y1+10, 	duration:400,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 									pause:200,		cursor:'demo', },

		{ act:'moveLin', x: 3*sp2+2.5*width2, y: y2+10, 		duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 									pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: 2*sp1+1.5*width1, y: y1+10, 	duration:400,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 									pause:200,		cursor:'demo', },

		{ act:'moveLin', x: 3*sp2+2.5*width2, y: y2+10, 		duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 									pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: 3*sp1+2.5*width1, y: y1+10, 	duration:400,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 									pause:200,		cursor:'demo', },

		{ act:'moveLin', x: 4*sp2+3.5*width2, y: y2+10, 		duration:300,	pause:200,		cursor:'demo', },
		{ event:'mousedown', 									pause:400,		cursor:'demo_click', },
		{ act:'moveLin', x: 2*sp1+1.5*width1, y: y1+10, 	duration:400,	pause:100,		cursor:'demo_click', },
		{ event:'mouseup', 									pause:400,		cursor:'demo', },

		// delete lines
		{ act:'moveLin', x: (cps[4].x+cps[1].x)/2, y: (cps[4].y+cps[1].y)/2, 	duration:200,	pause:200,		cursor:'demo', },
		{ 																 		pause:200,		cursor:'demo_click', },
		{ event:'mousedown', 									pause:100,		cursor:'demo', },

		{ act:'moveLin', x: (cps[5].x+cps[1].x)/2, y: (cps[5].y+cps[1].y)/2, 	duration:200,	pause:200,		cursor:'demo', },
		{ 																 		pause:200,		cursor:'demo_click', },
		{ event:'mousedown', 									pause:100,		cursor:'demo', },

		{ act:'moveLin', x: (cps[5].x+cps[2].x)/2, y: (cps[5].y+cps[2].y)/2, 	duration:200,	pause:200,		cursor:'demo', },
		{ 																 		pause:200,		cursor:'demo_click', },
		{ event:'mousedown', 									pause:100,		cursor:'demo', },

		{ act:'moveLin', x: (cps[6].x+cps[1].x)/2, y: (cps[6].y+cps[1].y)/2, 	duration:200,	pause:200,		cursor:'demo', },
		{ 																 		pause:200,		cursor:'demo_click', },
		{ event:'mousedown', 									pause:100,		cursor:'demo', },
	],
})

