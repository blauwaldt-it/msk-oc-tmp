export function clearCfgJson( json ) {

	if ( typeof json !== 'object' ) {
		return json;
	}
	if ( Array.isArray(json) ) {
		return json.map( a => clearCfgJson(a) )
	}

	const res = {};

	Object.entries( json ).forEach( ([k,v]) => {

		if ( k.substring( 0, 3 ) === '___' ) {

			// // Keys der Elemente eines Arrays nehmen
			// const arelkeys = k.match( /^___arelkeys_(.*)/ );
			// if ( arelkeys ) {
			// 	json[ arelkeys[1] ] = v.map( e => Object.keys(e) );
			// } else {

				// Vals der Elemente eines Arrays nehmen
				const arelvals = k.match( /^___arelvals_(.*)/ );
				if ( arelvals ) {
					res[ arelvals[1] ] = v.map( e => Object.values(e).map( a => clearCfgJson(a) ) );
				} else {

					// Alternative Namen einfach so speichern
					const alts = k.match( /^___alt[^_]*_(.*)/ );
					if ( alts ) {
						if ( v !== undefined ) {
							res[ alts[1] ] = clearCfgJson( v );
						}
					} else {

						// ___ Object in json integrieren
						if ( typeof v === 'object' ) {
							Object.assign( res, clearCfgJson(v) );
						}

					}
				}
			// }

		} else {

			if ( v !== undefined ) {
				res[ k ] = clearCfgJson(v);
			}

		}
	})

	return res;
}

//////////////////////////////////////////////////////////////////////////////

export function addScoringValsParser (obj) {

	obj.parseScoringVals = function (opts) {
		if ( opts.dataSettings && opts.dataSettings.scoringVals ) {

			const scoringVals = opts.dataSettings.scoringVals;
			const pref = opts.dataSettings.variablePrefix;

			const scores = this.scoreDef();
			if ( typeof scores === 'object' ) {
				const varNames = Object.keys( scores );
				if ( varNames.length>0 ) {

					scoringVals.forEach( sv => {
						let cond = sv.condition;
						if ( cond ) {
							let saveCond = cond;
							const allVarsInCond = cond.matchAll( /\[([^\]]*)]/g );
							for ( const vn of allVarsInCond ) {
								if ( vn[1].length == 0 ) {
									console.error( `Variablen-Name '[]' in Scoring nicht zulässig` );
								} else {
									const re = new RegExp( vn[1], 'i' );
									const selVarNames = varNames.filter( v => v.match(re) );
									if ( selVarNames.length>1 ) {
										console.error( `Variablen-Name '[${vn[1]}]' in Scoring ist nicht eindeutig`);
										saveCond = '';
									} else if ( selVarNames.length == 0 ) {
										console.error( `Variablen-Name '[${vn[1]}]' in Scoring unbekannt`);
										saveCond = '';
									} else {
										saveCond = saveCond.replace( vn[0], `res.${selVarNames[0]}` );
									}
								}
							}
							if ( saveCond ) {
								if ( !( 'scoringVals' in this ) ) {
									this.scoringVals = {};
								}
								this.scoringVals[ sv.val ] = saveCond;
							}
						}
					});
				}
			}
		}
	}

	obj.computeScoringVals = function (res) {
		if ( this.scoringVals ) {
			let score = null;
			const scoreDat = Object.entries( this.scoringVals );
			for ( let h=0; score==null && h<scoreDat.length; h++ ) {
				const [v,c] = scoreDat[h];
				try {
					if ( eval(c) ) {
						score = v;
					}
				} catch (e) {}
			}
			const n = Number(score)
			res[ `S_${this.dataSettings.variablePrefix}` ] = score!== null && n!==NaN ? n : score;
		}
	}

}

//////////////////////////////////////////////////////////////////////////////

export function addStatusVarDef ( obj, json ) {

	if ( !obj.statusVarDef && json.dataSettings && json.dataSettings.variablePrefix ) {
		const statVarName = `V_${json.dataSettings.variablePrefix}_Status`;
		obj.statusVarDef = function () {
			return {
				[statVarName]: +this.getDefaultChangeState(),
			}
		}
	}

}


//////////////////////////////////////

// convert "1 34,5:6-9" to [1,34,5,6,7,8,9]
export const readRangeArray = function ( s ) {
	const res = [];

	for ( const rr of s.matchAll( /([0-9]+) *(?:- *([0-9]+))?/g ) ) {
		if ( rr[2] && rr[1]<rr[2] ) {
			const rr2=Number(rr[2]);
			for ( let h=Number(rr[1]); h<=rr2; h++ ) {
				res.push(h);
			}
		} else {
			res.push( Number(rr[1]) )
		}
	}

	return res;
}
