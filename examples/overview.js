import './overview.css'

const getSrc = f => `${f.item}_${f.fnExt}.html`;

const { itemData } = require('./itemData.js');

document.getElementById('container').remove();

// create iframes
itemData.forEach( f => {

	const iframe = document.createElement( "iframe" );
	const src = getSrc(f);
	iframe.setAttribute( 'src', src+'?noDemoAni' );
	iframe.setAttribute( 'width', f.width || 500 );
	iframe.setAttribute( 'height', f.height || 250 );

	const div = document.createElement( "div" );
	div.innerHTML = `${f.title} <a href="${src}" name="${f.title}">${src}</a><br>`;
	div.appendChild( iframe );

	document.body.appendChild( div );

})
