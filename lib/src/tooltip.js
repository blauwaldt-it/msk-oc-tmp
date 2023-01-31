import Konva from 'konva/lib/Core'
import { Image as kImage } from 'konva/lib/shapes/Image'

export class tooltip {

	constructor ( stage ) {
		this.stage = stage;
		this.layer = new Konva.Layer();
		stage.add( this.layer );

		this.image = null;
		this.kImages = {};	// { [src]: KONVA.Image }
	}

	///////////////////////////////////

	showImage ( defs={} ) {

		['width','height','src'].forEach( o => {
			if ( !( o in defs ) ) {
				throw( `tooltip: parameter '${o}' not specified!` );
			}
		});
		const defaults = {
			// width, height, src	// properties of image
			offsetX: 10, 	// offset to mousepointer position
			offsetY: 10,
			konvaOpts: {},
			kImages: [],
		};
		defs = Object.assign( {}, defaults, defs );

		// image loaded?
		if ( defs.src in this.kImages ) {

			this.image = this.kImages[ defs.src ];
			this.image.x( this.stage.getPointerPosition().x + defs.offsetX );
			this.image.y( this.stage.getPointerPosition().y + defs.offsetY );
			this.image.visible( true );
			this.layer.batchDraw();

		} else {

			// load image
			const image = new Image();
			image.onload = () => {
				if ( this.loading ) {
					this.image = new Konva.Image( Object.assign( {
						x: this.stage.getPointerPosition().x + defs.offsetX,
						y: this.stage.getPointerPosition().y + defs.offsetY,
						width: defs.width,
						height: defs.height,
						image,
					}, defs.konvaOpts ) );
					this.kImages[defs.src] = this.image;
					this.layer.add( this.image );
					this.layer.draw();
				}
			}
			this.loading = 1;
			image.src = defs.src;
		}

		this.stage.on( "mousemove.tooltip", function () {
			if ( this.image) {
// console.log( this.stage.getPointerPosition().x + defs.offsetX, this.stage.getPointerPosition().y + defs.offsetY )
				this.image.x( this.stage.getPointerPosition().x + defs.offsetX );
				this.image.y( this.stage.getPointerPosition().y + defs.offsetY );
				this.layer.batchDraw();
			}
		}.bind(this) );

		this.layer.moveToTop();
	}

	hide () {
		this.loading = 0;
		this.stage.off( "mousemove.tooltip" );
		if ( this.image) {
			this.image.visible(false);
			this.image = null;
			this.layer.batchDraw();
		}
	}

}
