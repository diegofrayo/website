import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { T_Locale } from "~/types";

class I18NService {
  LOCALES: T_Locale[] = ["es", "en"];
  DEFAULT_LOCALE: T_Locale = this.LOCALES[0];
  INSTANCE;

  constructor() {
    this.createI18NInstance = this.createI18NInstance.bind(this);
    this.getInstance = this.getInstance.bind(this);
  }

  createI18NInstance({ messages, locale }) {
    if (!this.INSTANCE) {
      this.INSTANCE = i18n;
    } else {
      this.INSTANCE = i18n.createInstance();
    }

    this.INSTANCE.use(initReactI18next).init({
      resources: {
        [locale]: messages,
      },
      lng: locale,
      fallbackLng: this.DEFAULT_LOCALE,
      debug: false,
    });

    return this.INSTANCE;
  }

  getInstance() {
    return this.INSTANCE;
  }

  getCurrentLocale() {
    return i18n.language || this.DEFAULT_LOCALE;
  }

  getContentLocale(
    locales: T_Locale[],
    defaultLocale: T_Locale,
    currentLocale: T_Locale,
  ): T_Locale {
    return locales.indexOf(currentLocale) !== -1 ? currentLocale : defaultLocale;
  }
}

export default new I18NService();
