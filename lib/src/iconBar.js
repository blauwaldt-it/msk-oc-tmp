import { ignoreEvent } from './common'

import { tooltip } from './tooltip'

import Konva from 'konva/lib/Core'
import { Rect } from 'konva/lib/shapes/Rect'
import { Text } from 'konva/lib/shapes/Text'
import { Image as kImage } from 'konva/lib/shapes/Image'

export class iconBar {

	constructor ( stage, opts = {} ) {

		// Options and defaults
		['icons','x','y','width','height'].forEach( o => {
			if ( !( o in opts ) ) {
				throw( `iconBar: parameter '${o}' not specified!` );
			}
		})
		const defaults = {
			// x, y
			// width, height	// w&h of icon, total dimension += 2*(frameWidth+framePadding)
			spacing: 5,

			frameColor: 'gray',
			framePadding: 2,
			frameWidth: 1,
			frameFill: null,

			highlightColor: '#FFA99A',
			highlightFrame: '#8c3627',

			default: null, // index of icon
			active: null,

			// icons: [{
			// }]
			sticky: true,	// icon remains active after mouseup/touchend?

			toolTipFontSize: 10,
			toolTipFill: 'yellow',

			direction: 'v',	// v | h (vertical | horizontal )

			shareModesWith: null,		// [] or function returning [] of iconBars that should be deactivated when iconof this iconBar is activated
		}
		const defaultIcon = {
			// extraSpace: 	// no icon, leave extra Space

			// kCreateFunc: function (x,y,iconBarObj)	// function returns KONVA Object on coords x, y OR
			// src: set image.src OR
			// text: text to display (object with options for Konva.Text({}))
			toolTip: null,
			cursor: null,		// cursor, when activated
			cursorOver: null,	// cursor, when "mouseover", e.g. "url(icon.png) 16 16, auto"
			tooltipImage: null,
			on: () => 1,
			off: () => 1,
		}
		const defaultTextOptions = {
			align: 'center',
			verticalAlign: 'middle',
			fontSize: 20,
		}
		Object.assign( this, defaults, opts );
		this.stage = stage;
		this.layer = new Konva.Layer();
		stage.add( this.layer );

		// Icons
		const wp = this.frameWidth + this.framePadding;
		let x = this.x, y = this.y;
		this.icons.forEach( (i,nr) => {

			if ( i.extraSpace ) {

				if ( this.direction=='v' ) {
					y += i.extraSpace===true ? this.height : i.extraSpace;
				} else {
					x += i.extraSpace===true ? this.width : i.extraSpace;
				}

			} else {
				// i is altered!

				i = Object.assign( {}, defaultIcon, i );
				// image-tooltip?
				if ( i.tooltipImage && !this.tooltip ) {
					this.tooltip = new tooltip(this.stage);
					this.stage.on( 'mouseleave', (ev) => {
						if ( ignoreEvent( this.stage, ev ) ) {
							return;
						}
						this.tooltip.hide()
				 	})
				}

				// frame
				if ( this.frameWidth || this.frameFill || this.highlightColor ) {
					i.kFrame = new Konva.Rect({
						x, y,
						width: this.width + 2*wp,
						height: this.height + 2*wp,
						stroke: this.frameColor,
						strokeWidth: this.frameWidth,
						fill: this.frameFill,
					});
					this.layer.add( i.kFrame );
				}

				// draw KONVA object?
				if ( i.kCreateFunc ) {
					i.kObj = i.kCreateFunc( x + wp, y + wp, this );
					if ( i.kObj ) {
						this.layer.add( i.kObj );
					}
				}

				// icon
				const rectAttr = {
					width: this.width,
					height: this.height,
					x: x + wp,
					y: y + wp,
				};


				// interactivity
				const setInteract = (kObj) => {
					kObj.on( 'mousedown touchstart', (ev) => {
						ev.cancelBubble = true;
						if ( ev.evt ) {		// ev.evt might not be present (e.g. during demoAnimation)
							ev.evt.preventDefault();	// e.g. no blur in input fields
							ev.evt.stopPropagation();
						}
						this.clickOn( nr, ev );
					});
					kObj.on( 'click', (ev) => {
						ev.cancelBubble = true;
						if ( ev.evt ) {		// ev.evt might not be present (e.g. during demoAnimation)
							ev.evt.preventDefault();	// e.g. no blur in input fields
							ev.evt.stopPropagation();
						}
					});
					if ( !this.sticky ) {
						kObj.on( 'mouseup touchend mouseleave', (ev) => {
							if ( ignoreEvent( this.stage, ev ) ) {
								return;
							}
							this.deactivate( ev );
					 	});
					}
					if ( i.cursorOver ) {
						kObj.on( 'mouseenter', () => {
							this.cursorSaved = document.body.style.cursor;
							document.body.style.cursor = i.cursorOver;
							this.cursorSet = document.body.style.cursor;
						});
						kObj.on( 'mouseleave', (ev) => {
							if ( ignoreEvent( this.stage, ev ) ) {
								return;
							}
							if ( document.body.style.cursor == this.cursorSet ) {
								document.body.style.cursor = this.cursorSaved
								this.cursorSet = null;
							}
						});
					}
					if ( i.tooltipImage ) {
						kObj.on( 'mouseenter', () => this.tooltip.showImage( i.tooltipImage ) );
						kObj.on( 'mouseleave', (ev) => {
							if ( ignoreEvent( this.stage, ev ) ) {
								return;
							}
							this.tooltip.hide();
						});
					}
				}

				if ( i.src ) {
					// create image
					const image = new Image();
					image.onload = () => {
						i.kIcon = new Konva.Image( Object.assign( { image }, rectAttr ) );
						this.icons[nr].kIcon = i.kIcon;

						setInteract( i.kIcon );
						this.layer.add( i.kIcon );
						this.layer.batchDraw();
					};
					image.src = i.src;
				} else if ( i.text ) {
					// text as icon given?
					i.kIcon = new Konva.Text( Object.assign( {}, defaultTextOptions, i.text, rectAttr ));

					setInteract( i.kIcon );
					this.layer.add( i.kIcon );
				} else {
					// no image.src -> draw invisible rectangle
					// (hit area e.g. for icon created by kCreateFunc())
					i.kIcon = new Konva.Rect( Object.assign( {}, rectAttr, {
						fill: 'black',
						opacity: 0,
					} ));

					setInteract( i.kIcon );
					this.layer.add( i.kIcon );
				}

				// get position for next icon
				const offs = nr*( this.spacing + this.height+2*wp );
				if ( this.direction=='v' ) {
					y += this.spacing + this.height + 2*wp;
				} else {
					x += this.spacing + this.width + 2*wp;
				}

				this.icons[nr] = i;
			}
		})

		if ( this.default!==null && this.sticky ) {
			this.clickOn( this.default );
		}

		this.layer.draw();
	}

	///////////////////////////////////

	getOverallHeight () {
		return this.direction=='v' ?
			this.icons.length * ( this.spacing + this.height + 2*( this.frameWidth + this.framePadding ) ) - this.spacing :
			this.height + 2*( this.frameWidth + this.framePadding );
	}

	getOverallWidth () {
		return this.direction=='v' ?
			this.width + 2*( this.frameWidth + this.framePadding ) :
			this.icons.length * ( this.spacing + this.width + 2*( this.frameWidth + this.framePadding ) ) - this.spacing;
	}

	///////////////////////////////////

	clickOn ( index, ev ) {
		const saved_active = this.active;
		this.deactivate();
		if ( this.shareModesWith ) {
			const ar = typeof this.shareModesWith === 'function' ? this.shareModesWith() : this.shareModesWith;
			ar.forEach( iconBar => {
				if ( iconBar && iconBar!=this ) {
					iconBar.deactivate();
				}
			})
		}
		if ( saved_active===null || saved_active!=index ) {
			this.activate( index, ev );
		}
	}

	deactivate () {
		if ( this.active!==null ) {
			const icon = this.icons[ this.active ];
			if ( icon.kFrame ) {
				icon.kFrame.fill( this.frameFill );
				icon.kFrame.stroke( this.frameColor );
			}
			this.layer.batchDraw();

			if ( icon.off ) {
				icon.off();
			}

			if ( icon.cursor ) {
				document.body.style.cursor = "default";
			}
			this.active = null;
		}
	}

	activate ( index, ev ) {
		const icon = this.icons[index];
		if ( icon.kFrame ) {
			icon.kFrame.fill( this.highlightColor );
			icon.kFrame.stroke( this.highlightFrame );
		}
		this.layer.batchDraw();

		this.active = index;
		if ( icon.on ) {
			icon.on(ev);
		}

		if ( icon.cursor ) {
			document.body.style.cursor = icon.cursor;
		}
	}

	isActive ( index ) {
		return this.active === index;
	}

	destroy () {
		this.layer.destroy();
	}
}
