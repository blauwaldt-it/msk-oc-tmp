import './main.css'

import { baseInits } from '../../lib/src/baseInits'
import { pointArea } from '../../lib/src/pointArea';

const base = new baseInits( { container: 'container' } );

const resHeight = 10*20 + 2*4;
const x = ( base.height - resHeight ) / 2;
const y = x;

const io = new pointArea( base, {

	x, y,

	notMarkablePoints: __param1,

/// #if __hasFsmVariableName
	FSMVariableName: __fsmVariableName,
/// #endif
/// #if __hasScoreVariableName
	scoreVariableName: __scoreVariableName,
/// #endif

});

window.getState = io.getState.bind(io);
window.setState = io.setState.bind(io);
