import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import I18NService from "~/services/i18n";

import { parseSiteText, pluralize } from "./internationalization";
import { replaceAll } from "./strings";

dayjs.extend(customParseFormat);

export function getDifferenceBetweenDates(startDate: string, endDate: Date): string {
  const translator = I18NService.getInstance();

  const difference: number = dayjs(endDate).diff(dayjs(startDate, "YYYY/MM/DD"), "day");

  if (difference === 0) {
    return translator.t("page:today");
  }

  if (difference === 1) {
    return translator.t("page:yesterday");
  }

  if (difference < 7) {
    return parseSiteText(translator.t("page:days_ago"), { days: difference });
  }

  if (difference < 30) {
    return parseSiteText(translator.t("page:weeks_ago"), {
      weeks_value: Math.round(difference / 7),
      weeks_text: pluralize(
        Math.round(difference / 7),
        {
          singular: translator.t("page:week"),
          plural: translator.t("page:weeks"),
        },
        { includeNumber: false },
      ),
    });
  }

  if (difference < 365) {
    return parseSiteText(translator.t("page:months_ago"), {
      months_value: Math.round(difference / 30),
      months_text: pluralize(
        Math.round(difference / 30),
        {
          singular: translator.t("page:month"),
          plural: translator.t("page:months"),
        },
        { includeNumber: false },
      ),
    });
  }

  return parseSiteText(translator.t("page:years_ago"), {
    years_value: Math.round(difference / 365),
    years_text: pluralize(
      Math.round(difference / 365),
      {
        singular: translator.t("page:year"),
        plural: translator.t("page:years"),
      },
      { includeNumber: false },
    ),
  });
}

export function formatDate(date: string): string {
  return replaceAll(date, "-", "/");
}
