import Konva from 'konva/lib/Core'
import { Rect } from 'konva/lib/shapes/Rect'
import { Image as kImage } from 'konva/lib/shapes/Image'

export class demoAni {

	constructor ( stage, aniDefs={} ) {

		['getState','setState','ani'].forEach( o => {
			if ( !( o in aniDefs ) ) {
				throw( `demoAni: parameter '${o}' not specified!` );
			}
		})
		const defaults = {
			// cursor: {
			// 	cursorname: { cursor: 'demo_cursor.png', cursorOfX: 8, cursorOfY: 3, },
			// }
			// ani : [
			// 	{ act: , x:, y:, cursor:, duration:, pause: }
			// ],
			val2x: null, 	// function to convert "scaled" x-coordinates to absolute values
			val2y: null, 	// function to convert "scaled" y-coordinates to absolute values
			repeats: 5,
			beginDelay: 300,
			delay: 30,
		}
		Object.assign( this, defaults, aniDefs );
		this.stage = stage;
		this.layer = new Konva.Layer();
		stage.add( this.layer );
		this.stage.isDemoAni = this;

		// add invisible rect to catch user interactions
		this.layer.add( new Konva.Rect({
			x:0, y:0,
			width: this.stage.width(), height: this.stage.height(),
			opacity: 0,//.5,
		}) )
		this.layer.on( 'mouseover mousemove mouseout mouseenter mouseleave mouseup wheel contextmenu click dblclick touchmove touchend tap dbltap dragstart dragmove dragend', (ev) => {
			// console.log(performance.now(),ev);
			ev.cancelBubble = true;
		})

		this.startState = aniDefs.getState();


		this.layer.on( 'mousedown.demoAni touchstart.demoAni', function (ev) {
			if ( !ev.simX ) {
				this.endAni();
				ev.cancelBubble = true;
			}
		}.bind(this) );

		// load all referenced cursor
		if ( this.cursor ) {
			this.loadCursor( this.cursor  );
		}

		// inits
		this.currentPointerPos = {
			x: this.stage.width()*2/3,
			y: this.stage.height()*2/3,
		}
		this.currentAniIndex = this.ani.length;
		this.elementsUnderCursor = [];
		this.repeats++;

		// convert all "scaled" coordinates ('387s') to absolute coordinates
		this.ani.forEach( ani =>{
			if ( this.val2x && ani.x && ani.x.toString().substr(-1)=='s' ) {
				ani.x = this.val2x( +ani.x.substr( 0, ani.x.length-1 ) );
			}
			if ( this.val2y && ani.y && ani.y.toString().substr(-1)=='s' ) {
				ani.y = this.val2y( +ani.y.substr( 0, ani.y.length-1 ) );
			}
		})

		// start Animations
		window.setTimeout( this.nextAni.bind(this), this.beginDelay );
	}

	///////////////////////////////////

	endAni ( resetState=true ) {
		this.repeats = 0;

		// this.layer.off( '.demoAni' );
		this.layer.destroy();
		this.stage.isDemoAni = null;
		window.setTimeout( function () {
			document.body.style.cursor = 'default';
			if ( resetState ) {
				this.setState( this.startState )
			}
		}.bind(this), 0 );
	}

	nextAni () {

		if ( this.repeats <= 0 ) {
			return;
		}

		// next animation sequence
		this.currentAniIndex++;
		if ( this.currentAniIndex >= this.ani.length ) {
			this.currentAniIndex = 0;
			if ( --this.repeats <= 0 ) {
				this.endAni();

			} else {

				this.stage.isDemoAni = null;	// otherwise setState would stop demoAni
				this.setState( this.startState );
				this.stage.isDemoAni = this;

				this.layer.moveToTop();
				this.mouseButtonDown = false;
			}
		}

		this.lastPointerPos = this.currentPointerPos;
		this.currentAni = this.ani[ this.currentAniIndex ];
		this.aniStart = performance.now();

		this.doAni();
	}

	///////////////////////////////////

	doAni () {

		if ( this.repeats <= 0 ) {
			return;
		}

		const timeFrame = this.currentAni.duration ? Math.min( 1, ( performance.now()-this.aniStart ) / this.currentAni.duration ) : 1;
		this.currentPointerPos = this.getNewAniPos( timeFrame );

		// send Events
		const elemsAtCurrentPos = this.getElemsAtCurrentPos();
		const newIn = elemsAtCurrentPos.filter( el => !this.elementsUnderCursor.includes(el) );
		const newOut = this.elementsUnderCursor.filter( el => !elemsAtCurrentPos.includes(el) );
		const evData = { simX: this.currentPointerPos.x, simY: this.currentPointerPos.y };
		if ( newIn.length ) {
// console.log( 'IN: ', newIn.map( e => e.getClassName() ) );
			newIn.forEach( el => el.fire( 'mouseenter', evData, true ) );
			// newIn.forEach( el => el.fire( 'mouseover', {}, true ) );
			this.elementsUnderCursor = elemsAtCurrentPos;
		}
		if ( newOut.length ) {
// console.log( 'OUT: ', newIn.map( e => e.getClassName() ) );
			newOut.forEach( el => el.fire( 'mouseleave', evData, true ) );
			this.elementsUnderCursor = elemsAtCurrentPos;
		}
		elemsAtCurrentPos.push( this.stage );
		elemsAtCurrentPos.forEach( el => {
			el.fire( 'mousemove', evData, false );
			if ( this.currentAni.event ) {
				el.fire( this.currentAni.event, evData, true );
			}
		})

		// textInput?
		if ( this.currentAni.textInputBlur || this.currentAni.textInput ) {
			const aEl = document.activeElement;
			if ( aEl.tagName=='INPUT' ) {
				if ( this.currentAni.textInput ) {
					aEl.value += this.currentAni.textInput;
				} else {
					aEl.blur();
				}
			}
		}

		// show/change cursor?
		const cursor = this.currentAni.cursor;
		if ( cursor ) {
			const kCursor = this.kCursor[cursor];
			// Cursor changed?
			if ( this.lastCursor != cursor ) {
				if ( this.lastCursor ) {
					this.kCursor[this.lastCursor].remove()
				}
				if ( kCursor ) {
					this.layer.add( kCursor );
// console.log( this.layer.find( () => true ).map( e => e.attrs.image.src ) )
					this.lastCursor = cursor;
				}
			}
			// show cursor at new position
			if ( kCursor ) {
				kCursor.x( this.currentPointerPos.x - ( this.cursor[ cursor ].cursorOfX || 0 ) );
				kCursor.y( this.currentPointerPos.y - ( this.cursor[ cursor ].cursorOfY || 0 ) );
				this.layer.batchDraw();
			}
		} else if ( this.lastCursor ) {
			this.kCursor[this.lastCursor].remove();
			this.lastCursor = null;
			this.layer.batchDraw();
		}

		// Next frame
		if ( timeFrame == 1 ) {
			window.setTimeout( this.nextAni.bind(this), this.currentAni.pause || 0 );
		} else {
			if ( window.requestAnimationFrame ) {
				window.requestAnimationFrame( this.doAni.bind(this) );
			} else {
				window.setTimeout( this.doAni.bind(this), this.delay );
			}
		}
	}

	///////////////////////////////////

	getNewAniPos ( timeFrame ) {

		function easeInOutSine( x ) {
			return -( Math.cos( Math.PI * x) - 1) / 2;
		}
		function easeInOutCubic( x ) {
			return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		}
		function easeInOutQuad( x ) {
			return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
		}
		const timeFrame_ = easeInOutQuad( timeFrame );

		switch ( this.currentAni.act ) {
			case 'moveLin':
				return {
					x: this.lastPointerPos.x + ( this.currentAni.x - this.lastPointerPos.x ) * timeFrame_,
					y: this.lastPointerPos.y + ( this.currentAni.y - this.lastPointerPos.y ) * timeFrame_,
				}
			case 'moveArcTop':
				return {
					x: this.lastPointerPos.x + ( this.currentAni.x - this.lastPointerPos.x ) * timeFrame_,
					y: this.lastPointerPos.y - Math.sin( Math.PI*timeFrame ) * this.currentAni.radius,
				}
			default:
				return {
					x: this.currentAni.x || this.lastPointerPos.x,
					y: this.currentAni.y || this.lastPointerPos.y,
				}
		}

	}

	///////////////////////////////////

	getElemsAtCurrentPos () {

		const res = [];
		const currPos = this.currentPointerPos;

		this.stage.getLayers().forEach( layer => {
			if ( layer!=this.layer ) {
				const el = layer.getIntersection( currPos );
				if ( el ) {
					res.push( el );
				}
			}
		})

		return res;
	}

	loadCursor ( carr ) {

		this.kCursor = [];

		// Load cursor as Konva Image into kCursor[c]
		Object.keys( carr ).forEach( c => {
			const image = new Image();
			image.onload = () => {
				this.kCursor[c]	= new Konva.Image({ image });
			}
			image.src = carr[c].cursor;
		})
	}

}
