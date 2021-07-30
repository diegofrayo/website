import { T_GenerateSupportedLocales, T_Locale, T_Object } from "~/types";

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

export const parseSiteText = (text: string, words: T_Object<string | number>): string => {
  return Object.entries(words).reduce((result, [key, value]) => {
    return result.replace(`<${key}>`, String(value));
  }, text);
};
