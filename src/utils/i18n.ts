import Texts from "~/data/texts.json";
import { DEFAULT_LOCALE } from "~/utils/constants";

export function getSiteTexts({ page, layout }: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  if (layout) {
    result.layout = {
      config: Texts.layout.config,
      common: Texts.layout.common,
      current_locale: Texts.layout[DEFAULT_LOCALE],
    };
  }

  if (page) {
    const pageContent = Texts.pages[page];

    result.page = {
      config: pageContent.config || {},
      common: pageContent.common || {},
      current_locale:
        pageContent[
          pageContent.config && pageContent.config.default_locale
            ? pageContent.config.default_locale
            : DEFAULT_LOCALE
        ],
    };
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
