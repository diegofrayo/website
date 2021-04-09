import Texts from "~/data/texts.json";
import { T_GenerateSupportedLocales, T_GetSiteTextsParam, T_Locale, T_SiteTexts } from "~/types";

const LOCALES: T_Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: T_Locale = LOCALES[0];
let CURRENT_LOCALE: T_Locale = DEFAULT_LOCALE;

export function getSiteTexts({
  page,
  layout,
  locale = CURRENT_LOCALE,
}: T_GetSiteTextsParam): T_SiteTexts {
  const result: T_SiteTexts = {
    layout: {
      config: {},
      common: {},
      current_locale: {},
    },
    page: {
      config: {},
      common: {},
      current_locale: {},
    },
  };

  if (layout) {
    result.layout = {
      config: Texts.layout.config,
      common: Texts.layout.common,
      current_locale: Texts.layout[locale],
    };
  }

  if (page) {
    const pageContent: any = Texts.pages[page];

    result.page = {
      config: pageContent.config || {},
      common: pageContent.common || {},
      current_locale:
        pageContent[
          getItemLocale(pageContent.config.locales, pageContent.config.default_locale, locale)
        ],
    };
  }

  return result;
}

export function getCurrentLocale(): T_Locale {
  return CURRENT_LOCALE;
}

export function setCurrentLocale(locale: T_Locale): void {
  CURRENT_LOCALE = locale;
}

export function extractLocaleFromUrl(): T_Locale {
  const [locale] = window.location.pathname.split("/") as T_Locale[];

  if (LOCALES.indexOf(locale) !== -1) {
    return locale;
  }

  return CURRENT_LOCALE;
}

export function getItemLocale(
  locales: T_Locale[],
  defaultLocale: T_Locale,
  currentLocale: T_Locale,
): T_Locale {
  return locales.indexOf(currentLocale) !== -1 ? currentLocale : defaultLocale;
}

export function generateSupportedLocales(
  locales: T_Locale[],
  route: string,
): T_GenerateSupportedLocales {
  return locales.map((locale: T_Locale) => ({
    name: locale,
    route,
  }));
}

export const pluralize = (
  number: number,
  word: { singular: string; plural: string } | string,
  { includeNumber = true }: { includeNumber?: boolean } = {},
): string => {
  let result = `${includeNumber ? number : ""}`;

  if (typeof word === "string") {
    result += word + (number === 1 ? "" : "s");
  } else {
    result += number === 1 ? word.singular : word.plural;
  }

  return result.trim();
};

export const parseSiteText = (text: string, words: Record<string, string | number>): string => {
  return Object.entries(words).reduce((acum, [key, value]) => {
    return acum.replace(`<${key}>`, String(value));
  }, text);
};
