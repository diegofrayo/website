((window, document) => {
  const APP_CONFIGURATION = {
    ENVIRONMENT:
      window.location.href.indexOf('localhost') !== -1 ? 'development' : 'production',
  };

  const initGA = () => {
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    const location = window.location.href;

    ga('create', 'UA-98284306-1', 'auto', 'website', {
      location: location,
      page: '/',
      title: document.title,
    });
    ga('set', 'location', location);
    ga('set', 'page', '/');
    ga('website.send', 'pageview');
  };

  const getCookie = cname => {
    const cookieData = document.cookie.split(';');
    const name = cname + '=';

    for (let index = 0; index < cookieData.length; index += 1) {
      let cookieChunk = cookieData[index];

      while (cookieChunk.charAt(0) === ' ') {
        cookieChunk = cookieChunk.substring(1);
      }

      if (cookieChunk.indexOf(name) === 0) {
        return cookieChunk.substring(name.length, cookieChunk.length);
      }
    }

    return false;
  };

  const onClickGA_Element = event => {
    const elementNameClicked = event.currentTarget.getAttribute('data-element-name');
    if (!elementNameClicked) return;

    ga('website.send', {
      hitType: 'event',
      eventCategory: 'homepage',
      eventAction: 'click',
      eventLabel: elementNameClicked,
    });
  };

  const configureGAEvents = () => {
    let gaElements = document.getElementsByClassName('ga-element');

    for (let i = 0, length = gaElements.length; i < length; i++) {
      gaElements[i].addEventListener('click', onClickGA_Element, false);
    }

    gaElements = null;
  };

  const onReadyHandler = () => {
    const isLoggedIn = getCookie('auth');

    if (APP_CONFIGURATION.ENVIRONMENT === 'production' && isLoggedIn === false) {
      initGA();
      configureGAEvents();
    } else {
      document.getElementById('login-flag').style.display = 'block';
    }
  };

  document.addEventListener('DOMContentLoaded', onReadyHandler, false);
})(window, document);
