import './main.css'

import { isBetween, object_equals } from '../../lib/src/common'

import { baseInits } from '../../lib/src/baseInits'
import { barSlider_freePaint_freeLabels_insertButtons } from '../../lib/src/barSlider'

const varNam = "2c";

const inputRegexp = '^\\d{0,4} ?(?:%|[gG][bB]?)?$';

const base = new baseInits( { container: 'container' } );
const width = base.width;
const height = base.height;

const labWidth = 80;
const labs = {
	readonly: 1,
	width: labWidth,
	frameWidth: 0,
	fontSize: 22,
}

const iconWidth = 24;
const iconPadding = 2;
const iconWidthAll = iconWidth+2*iconPadding;

const barX = iconWidthAll+15+labWidth;
const barHeight = 40;
const barWidth = width-barX-labWidth-20 -iconWidthAll -15;
const barY = (height-barHeight)/2;

const yLabTop = barY-29;
const yLabBot = barY+barHeight+6;
const xLabMin = barX-labWidth-1;
const xLabMax = barX+barWidth+1;

const io = new barSlider_freePaint_freeLabels_insertButtons( base, {

	x: barX, y: barY,
	width: barWidth, height: barHeight,
	markedFillColor: '#6666ff',
	sliderHeight: barHeight+20,

	modeIconBarDef: {
		x: 0, y: (height-3*(iconWidth+2*iconPadding+2))/2,
		width: iconWidth, height: iconWidth,
		framePadding: iconPadding,
	},

	insertIconDefs: [{
		x: width-iconWidthAll*1.5-5,
		y: (height-2.5*(iconWidthAll+2))/2,
		width: iconWidth*1.5, height: iconWidth*1.5,
		framePadding: iconPadding,
		texts: ['%','GB'],
	}],

	freeLabels: [

		// min
		Object.assign( {}, labs, {
			x: xLabMin,	y: yLabTop,
			value: '0 %',
			align: 'right',
		}),
		Object.assign( {}, labs, {
			x: xLabMin,	y: yLabBot,
			value: '0 GB',
			align: 'right',
		}),

		// floating
		Object.assign( {}, labs, {
			y: yLabTop,
			readonly: 0,
			frameWidth: 1,
			inputRegexp,
			xFnc: function () {
				return Math.min( barX+barWidth-labWidth-1, Math.max( barX+1, this.val2x( this.pos )-labWidth/2 ) )
			},
		}),
		Object.assign( {}, labs, {
			y: yLabBot,
			readonly: 0,
			frameWidth: 1,
			inputRegexp,
			xFnc: function () {
				return Math.min( barX+barWidth-labWidth-1, Math.max( barX+1, this.val2x( this.pos )-labWidth/2 ) )
			},
		}),

		// max
		Object.assign( {}, labs, {
			x: xLabMax,	y: yLabTop,
			value: '100 %',
			align: 'left',
		}),
		Object.assign( {}, labs, {
			x: xLabMax,	y: yLabBot,
			value: '20 GB',
			align: 'left',
		}),
	],

	FSMVariableName: varNam,

	statusVarDef: function () {
		return this.pos != this.initData.pos &&
			this.freeLabels.filter( l => !l.readonly ).every( (l,i) =>
				l.textObj && this.initData.l && l.textObj.value != this.initData.l[i]
	 		);
	},

	scoreDef: function () {
		if ( !this.freeLabels[3].textObj )		return -2; 	// not initialized yet

		if ( isBetween( this.pos, 22/100, 38/100 ) &&
			this.freeLabels[2].textObj.value.trim().match( /^0*30 ?%$/ ) &&
			this.freeLabels[3].textObj.value.trim().match( /^0*6(?: ?[gG][bB])?$/ ) )		return 1;

		if ( object_equals( this.getChState(), this.initData ) )		return -1;

		if ( isBetween( this.pos, 52/100, 68/100 ) )	return -3;

		return -2;
	},
})
window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);

