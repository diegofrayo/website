import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { getSiteTexts, parseSiteText, pluralize } from "~/i18n";

import { Routes } from "./constants";

dayjs.extend(customParseFormat);
const SiteTexts = getSiteTexts({ page: Routes.BLOG() });

export function getDifferenceBetweenDates(startDate: string, endDate: Date): string {
  const difference = dayjs(endDate).diff(dayjs(startDate, "YYYY/MM/DD"), "day");

  if (difference === 0) {
    return SiteTexts.page.today;
  }

  if (difference === 1) {
    return SiteTexts.page.yesterday;
  }

  if (difference < 7) {
    return parseSiteText(SiteTexts.page.days_ago, { days: difference });
  }

  if (difference < 30) {
    return parseSiteText(SiteTexts.page.weeks_ago, {
      weeks_value: Math.round(difference / 7),
      weeks_text: pluralize(
        Math.round(difference / 7),
        {
          singular: SiteTexts.page.week,
          plural: SiteTexts.page.weeks,
        },
        { includeNumber: false },
      ),
    });
  }

  if (difference < 365) {
    return parseSiteText(SiteTexts.page.months_ago, {
      months_value: Math.round(difference / 30),
      months_text: pluralize(
        Math.round(difference / 30),
        {
          singular: SiteTexts.page.month,
          plural: SiteTexts.page.months,
        },
        { includeNumber: false },
      ),
    });
  }

  return parseSiteText(SiteTexts.page.years_ago, {
    years_value: Math.round(difference / 365),
    years_text: pluralize(
      Math.round(difference / 365),
      {
        singular: SiteTexts.page.year,
        plural: SiteTexts.page.years,
      },
      { includeNumber: false },
    ),
  });
}
