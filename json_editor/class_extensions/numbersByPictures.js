import { numbersByPictures } from '../../libs/numbersByPictures'
import { addScoringValsParser } from '../common';

export class numbersByPicturesFromSchema extends numbersByPictures {

	constructor ( base, opts={} ) {

		const iconWidth = 22;
		const depth = 18;

		opts.pics = {
			width: 60,
		}

		// iconbar default data
		if ( !opts.readonly ) {
			opts.iconBar = {
				x: opts.x,
				y: opts.y,
				width: iconWidth,
				height: iconWidth,
				frameFill: '#e5e5e5',
			}
		}

		// x is start of pics
		opts.x += iconWidth + 14;
		opts.y += Math.max( 0, 4*22 + 3*2 - ( opts.pics.width + depth ) ) / 2 + depth;
		if ( opts.width<= 0 ) {
			opts.width += base.width;
		}

		super( base, opts );

		addScoringValsParser(this);
		this.parseScoringVals(opts);
	}

	scoreDef () {
		if ( this.readonly ) {
			return {};
		}

		const pref = this.dataSettings.variablePrefix;
		const res = {
			[`V_${pref}_Input_T`]: this.data.reduce( (acc, cur) => acc += cur.c || 0, 0 ),
			[`V_${pref}_Input_H`]: this.data.reduce( (acc, cur) => acc += cur.r || 0, 0 ),
			[`V_${pref}_Input_Z`]: this.data.reduce( (acc, cur) => acc += cur.b || 0, 0 ),
			[`V_${pref}_Input_E`]: this.data.reduce( (acc, cur) => acc += cur.d || 0, 0 ),
		};

		if ( this.computeScoringVals ) {
			this.computeScoringVals( res );
		}
		return res;
	}

}