import Texts from "~/data/texts.json";

const LOCALES = ["es", "en"];
export const DEFAULT_LOCALE = LOCALES[0];
let CURRENT_LOCALE = DEFAULT_LOCALE;

export function getSiteTexts({
  page,
  layout,
  locale = CURRENT_LOCALE,
}: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  if (layout) {
    result.layout = {
      config: Texts.layout.config,
      common: Texts.layout.common,
      current_locale: Texts.layout[locale],
    };
  }

  if (page) {
    const pageContent = Texts.pages[page];

    result.page = {
      config: pageContent.config || {},
      common: pageContent.common || {},
      current_locale:
        pageContent[
          getItemLocale(
            pageContent.config.locales,
            pageContent.config.default_locale,
            locale,
          )
        ],
    };
  }

  return result;
}

export function getCurrentLocale() {
  return CURRENT_LOCALE;
}

export function setCurrentLocale(locale) {
  CURRENT_LOCALE = locale;
}

export function extractLocaleFromUrl() {
  const [locale] = window.location.pathname.split("/");

  if (LOCALES.indexOf(locale) !== -1) {
    return locale;
  }

  return CURRENT_LOCALE;
}

export function getItemLocale(locales, defaultLocale, currentLocale) {
  return locales.indexOf(currentLocale) !== -1 ? currentLocale : defaultLocale;
}

export function generateSupportedLocales(locales, route) {
  return locales.map(locale => ({
    name: locale,
    route,
  }));
}

export const pluralize = (
  number: number,
  word: string | Record<string, any>,
  { includeNumber = true }: Record<string, any> = {},
): string => {
  return `${includeNumber ? number : ""} ${
    typeof word === "string"
      ? word + (number === 1 ? "" : "s")
      : number === 1
      ? word.singular
      : word.plural
  }`.trim();
};

export const parseSiteText = (text: string, words: Record<string, any>): string => {
  return Object.entries(words).reduce((acum, [key, value]) => {
    return acum.replace(`<${key}>`, value);
  }, text);
};
