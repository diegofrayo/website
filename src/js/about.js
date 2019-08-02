((window, document, dfrz) => {
  const isAndroid = () => {
    return navigator.userAgent.toLowerCase().indexOf('android') > -1;
  };

  const getAndroidVersion = ua => {
    ua = (ua || navigator.userAgent).toLowerCase();
    const match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : undefined;
  };

  const detectEmojiSupport = () => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      const pixelRatio = window.devicePixelRatio || 1;
      const offset = 12 * pixelRatio;
      const node = window.document.createElement('canvas');
      const ctx = node.getContext('2d');
      if (!ctx) {
        return false;
      }

      ctx.fillStyle = '#f00';
      ctx.textBaseline = 'top';
      ctx.font = '32px Arial';
      ctx.fillText('\ud83d\udc28', 0, 0); // U+1F428 KOALA

      return ctx.getImageData(offset, offset, 1, 1).data[0] !== 0;
    } catch (e) {
      return false;
    }
  };

  const APP_CONFIGURATION = {
    ENVIRONMENT: dfrz.getEnvironment(),
    supportEmojis:
      detectEmojiSupport() && isAndroid() ? parseFloat(getAndroidVersion()) >= 5 : true,
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

    if (!APP_CONFIGURATION.supportEmojis) {
      document.body.classList.add('no-emojis-support');
    }
  };

  document.addEventListener('DOMContentLoaded', onReadyHandler, false);
})(window, document, window.dfrz);
