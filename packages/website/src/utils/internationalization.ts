import Texts from "~/data/texts.json";
import {
  TypeGenerateSupportedLocales,
  TypeGetSiteTextsParam,
  TypeLocale,
  TypeSiteTexts,
} from "~/types";

const LOCALES: TypeLocale[] = ["es", "en"];
export const DEFAULT_LOCALE: TypeLocale = LOCALES[0];
let CURRENT_LOCALE: TypeLocale = DEFAULT_LOCALE;

export function getSiteTexts({
  page,
  layout,
  locale = CURRENT_LOCALE,
}: TypeGetSiteTextsParam): TypeSiteTexts {
  const result: TypeSiteTexts = {
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

export function getCurrentLocale(): TypeLocale {
  return CURRENT_LOCALE;
}

export function setCurrentLocale(locale: TypeLocale): void {
  CURRENT_LOCALE = locale;
}

export function extractLocaleFromUrl(): TypeLocale {
  const [locale] = window.location.pathname.split("/") as TypeLocale[];

  if (LOCALES.indexOf(locale) !== -1) {
    return locale;
  }

  return CURRENT_LOCALE;
}

export function getItemLocale(
  locales: TypeLocale[],
  defaultLocale: TypeLocale,
  currentLocale: TypeLocale,
): TypeLocale {
  return locales.indexOf(currentLocale) !== -1 ? currentLocale : defaultLocale;
}

export function generateSupportedLocales(
  locales: TypeLocale[],
  route: string,
): TypeGenerateSupportedLocales {
  return locales.map((locale: TypeLocale) => ({
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
