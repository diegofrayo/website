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

export function getCurrentLocale(): TypeLocale {
  return CURRENT_LOCALE;
}

export function setCurrentLocale(locale: TypeLocale): void {
  CURRENT_LOCALE = locale;
}

export function extractLocaleFromUrl(): TypeLocale {
  const [locale] = window.location.pathname.split("/");

  if (LOCALES.indexOf(<TypeLocale>locale) !== -1) {
    return locale as TypeLocale;
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
    route, // TODO: Set type (possible values)
  }));
}

type TypePluralizeWordParam =
  | {
      singular: string;
      plural: string;
    }
  | string;

type TypePluralizeConfigParam = { includeNumber?: boolean };

export const pluralize = (
  number: number,
  word: TypePluralizeWordParam,
  { includeNumber = true }: TypePluralizeConfigParam = {},
): string => {
  return `${includeNumber ? number : ""} ${
    typeof word === "string"
      ? word + (number === 1 ? "" : "s")
      : number === 1
      ? word.singular
      : word.plural
  }`.trim();
};

export const parseSiteText = (
  text: string,
  words: Record<string, string | number>,
): string => {
  return Object.entries(words).reduce((acum, [key, value]) => {
    return acum.replace(`<${key}>`, value as any); // TODO: Avoid any
  }, text);
};
