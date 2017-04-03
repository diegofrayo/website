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

	ga('create', 'UA-90015747-1', 'auto', 'homepage');
	ga('homepage.send', 'pageview');
}
/* jshint ignore:end */

function initTypingInConsole() {

	var consoleText = document.getElementsByClassName('console__text')[0];
	var message = '<WebDeveloper />';
	var index = 0;

	var interval = setInterval(function() {

		consoleText.innerHTML = consoleText.innerHTML + message.charAt(index);
		index++;

		if (index === message.length) {

			var consoleCursor = document.getElementsByClassName('console__cursor')[0];

			setInterval(function() {
				if (consoleCursor.style.opacity !== '0') {
					consoleCursor.style.opacity = 0;
				} else {
					consoleCursor.style.opacity = 100;
				}
			}, 500);

			clearInterval(interval);
		}

	}, 100);

}

function gaElementClick() {

	var elementNameClicked = this.getAttribute('data-element-name');

	if (elementNameClicked) {
		ga('homepage.send', {
			hitType: 'event',
			eventCategory: 'Main',
			eventAction: 'click',
			eventLabel: elementNameClicked
		});
	}
}

function getCookie(cname) {

	var cookieData = document.cookie.split(';');
	var name = cname + '=';

	for (var index = 0; index < cookieData.length; index += 1) {

		var cookieChunk = cookieData[index];

		while (cookieChunk.charAt(0) === ' ') {
			cookieChunk = cookieChunk.substring(1);
		}

		if (cookieChunk.indexOf(name) === 0) {
			return cookieChunk.substring(name.length, cookieChunk.length);
		}
	}

	return false;
}


//-------------------Global Vars-------------------//
const APP_CONFIGURATION = {
	ENVIRONMENT: window.location.href.indexOf('homepage.local') !== -1 ? 'DEV' : window.location.href.indexOf('personal-website.local') !== -1 ? 'STAGING' : 'LIVE'
};


//-------------------onReadyCallback-------------------//
document.addEventListener('DOMContentLoaded', function() {

	var showAppsLinks = function() {
		document.querySelectorAll('.link-container--apps').forEach(function(element) {
			element.style.display = 'block';
		});
	};

	var isLoggedIn = getCookie('auth');

	if (APP_CONFIGURATION.ENVIRONMENT === 'LIVE') {

		if (isLoggedIn === false) {

			initGA();

			var gaElements = document.getElementsByClassName('ga-element');

			for (var i = 0, length = gaElements.length; i < length; i++) {
				gaElements[i].addEventListener('click', gaElementClick, false);
			}

		} else {
			showAppsLinks();
		}

	} else if (APP_CONFIGURATION.ENVIRONMENT === 'STAGING') {

		if (isLoggedIn) {
			showAppsLinks();
		}

	} else {
		showAppsLinks();
	}

	initTypingInConsole();

}, false);