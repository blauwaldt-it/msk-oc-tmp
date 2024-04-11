import './main.css'

import { baseInits } from '../libs/baseInits'
import { rectArea_freePaintMarker } from '../libs/rectArea'

import Konva from 'konva/lib/Core'
import { Rect } from 'konva/lib/shapes/Rect'
import { Line } from 'konva/lib/shapes/Line'


const settings = {
	x: 5,
	y: [ 5, 80, 190 ],
	width: 600,
	height: 45,
	FSMvariable: "1a_drawing",
	rectStrokeWidth: 3,
}
const yt = (n) => settings.y[n];
const yb = (n) => settings.y[n]+settings.height;
const xp = (p) => settings.x + settings.width*p/100;


const base = new baseInits( {
	container: 'container',
} );

const area = new rectArea_freePaintMarker( base, {

	x: 0, y: 0,
	width: settings.x+settings.width+25,
	height: Math.min( yb(2)+50, base.height ),
	frameWidth: 0,

	paintLines: {
		brush: {
			strokeWidth: 4,
		}
	},

	freePaintMarkerClipFunc (ctx) {
		ctx.rect( settings.x, yt(1), settings.width, settings.height );
		ctx.rect( settings.x, yt(2), settings.width, settings.height );
	},

	modeIconBarDef: {
		x: settings.x+settings.width+32, y: yt(0),
		width: 32, height: 32,
		spacing: 0,
		framePadding: 2,
	},

	FSMVariableName: settings.FSMvariable,
} );

window.getState = area.getState.bind(area);
window.setState = area.setState.bind(area);


// draw rectangles in a new front layer
const rectLayer = new Konva.Layer();
base.stage.add(rectLayer);

// first bar
rectLayer.add(new Konva.Rect({
	x: settings.x,
	y: yt(0),
	width: settings.width,
	height: settings.height,
	stroke: 'black',
	fill: 'white',
	strokeWidth: 2,
}));

rectLayer.add(new Konva.Rect({
	x: settings.x,
	y: yt(0),
	width: settings.width*0.75,
	height: settings.height,
	stroke: 'black',
	fill: 'lightgray',
	strokeWidth: 2,
}));
for ( let p = 12.5; p < 100; p +=12.5 ) {
	rectLayer.add(new Konva.Line({
		points: [ xp(p), yt(0), xp(p), yb(0) ],
		stroke: 'black',
		strokeWidth: 2
	}));
}

// second bar
rectLayer.add(new Konva.Rect({
	x: settings.x,
	y: yt(1),
	width: settings.width,
	height: settings.height,
	stroke: 'black',
	strokeWidth: 2,
}));

rectLayer.add(new Konva.Line({
	points: [ xp(25), yt(1), xp(25), yb(1) ],
	stroke: 'black',
	strokeWidth: 2 }));
rectLayer.add(new Konva.Line({
	points: [ xp(50), yt(1), xp(50), yb(1) ],
	stroke: 'black',
	strokeWidth: 2}));
rectLayer.add(new Konva.Line({
	points: [ xp(75), yt(1), xp(75), yb(1) ],
	stroke: 'black',
	strokeWidth: 2}));

// third bar
rectLayer.add(new Konva.Rect({
	x: settings.x,
	y: yt(2),
	width: settings.width,
	height: settings.height,
	stroke: 'black',
	strokeWidth: 2,
}));


rectLayer.batchDraw();
