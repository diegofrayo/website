((window, document, dfrz) => {
  const APP_CONFIGURATION = {
    ENVIRONMENT: dfrz.getEnvironment(),
  };

  const onClickGA_Element = event => {
    const elementNameClicked = event.currentTarget.getAttribute('data-element-name');
    if (!elementNameClicked) return;

    ga('website.send', {
      hitType: 'event',
      eventCategory: 'about-page',
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
    const isLoggedIn = dfrz.getCookie('auth');

    if (APP_CONFIGURATION.ENVIRONMENT === 'production' && isLoggedIn === false) {
      dfrz.initGA('about');
      configureGAEvents();
    } else {
      document.getElementById('login-flag').style.display = 'block';
    }
  };

  document.addEventListener('DOMContentLoaded', onReadyHandler, false);
})(window, document, window.dfrz);
