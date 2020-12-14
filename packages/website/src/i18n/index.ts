import { DEFAULT_LOCALE } from "~/utils/constants";

import Texts from "./texts.json";

export function getSiteTexts({ page, layout }: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  if (layout) {
    result.layout = Texts[DEFAULT_LOCALE].layout;
  }

  if (page) {
    result.page = Texts[DEFAULT_LOCALE].pages[page];
  }

  return result;
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
