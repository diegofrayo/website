import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { T_Locale } from "~/types";

class I18nService {
  private LOCALES: T_Locale[] = ["en", "es"];
  private DEFAULT_LOCALE: T_Locale = this.LOCALES[0];
  private CURRENT_LOCALE;
  private INSTANCE;

  constructor() {
    this.createInstance = this.createInstance.bind(this);
    this.getInstance = this.getInstance.bind(this);
  }

  createInstance({ messages, locale }) {
    this.CURRENT_LOCALE = locale;
    this.INSTANCE = i18n.createInstance();
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
    return this.CURRENT_LOCALE || this.DEFAULT_LOCALE;
  }

  getDefaultLocale() {
    return this.DEFAULT_LOCALE;
  }

  getContentLocale(
    locales: T_Locale[],
    currentLocale: T_Locale,
    defaultLocale: T_Locale,
  ): T_Locale {
    return locales.indexOf(currentLocale) !== -1 ? currentLocale : defaultLocale;
  }
}

export default new I18nService();
