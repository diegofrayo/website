/* jshint ignore:start */
function initGA() {

	(function(i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments)
		}, i[r].l = 1 * new Date();
		a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

	ga('create', 'UA-90015747-1', 'auto');
	ga('send', 'pageview');
}
/* jshint ignore:end */

function linkClick() {
	var linkNameClicked = this.getAttribute('data-link-name');
	console.log(linkNameClicked);
	// TRACK THIS EVENT
}



//-------------------Global Vars-------------------//
const APP_CONFIGURATION = {
	ENVIRONMENT: window.location.href.indexOf('diegorayo.com') !== -1 ? 'LIVE' : 'DEV'
};


//-------------------onReadyCallback-------------------//

document.addEventListener('DOMContentLoaded', function() {

	if (APP_CONFIGURATION.ENVIRONMENT === 'LIVE') {

		initGA();

		var links = document.getElementsByClassName('link');

		for (var i = 0, length = links.length; i < length; i++) {
			links[i].addEventListener('click', linkClick, false);
		}

	}

}, false);