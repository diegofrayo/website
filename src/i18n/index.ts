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
