import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { getSiteTexts, parseSiteText, pluralize } from "~/utils/i18n";

import { Routes } from "./constants";

dayjs.extend(customParseFormat);
const SiteTexts = getSiteTexts({ page: Routes.BLOG() });

export function getDifferenceBetweenDates(startDate: string, endDate: Date): string {
  const difference = dayjs(endDate).diff(dayjs(startDate, "YYYY/MM/DD"), "day");

  if (difference === 0) {
    return SiteTexts.page.current_locale.today;
  }

  if (difference === 1) {
    return SiteTexts.page.current_locale.yesterday;
  }

  if (difference < 7) {
    return parseSiteText(SiteTexts.page.current_locale.days_ago, { days: difference });
  }

  if (difference < 30) {
    return parseSiteText(SiteTexts.page.current_locale.weeks_ago, {
      weeks_value: Math.round(difference / 7),
      weeks_text: pluralize(
        Math.round(difference / 7),
        {
          singular: SiteTexts.page.current_locale.week,
          plural: SiteTexts.page.current_locale.weeks,
        },
        { includeNumber: false },
      ),
    });
  }

  if (difference < 365) {
    return parseSiteText(SiteTexts.page.current_locale.months_ago, {
      months_value: Math.round(difference / 30),
      months_text: pluralize(
        Math.round(difference / 30),
        {
          singular: SiteTexts.page.current_locale.month,
          plural: SiteTexts.page.current_locale.months,
        },
        { includeNumber: false },
      ),
    });
  }

  return parseSiteText(SiteTexts.page.current_locale.years_ago, {
    years_value: Math.round(difference / 365),
    years_text: pluralize(
      Math.round(difference / 365),
      {
        singular: SiteTexts.page.current_locale.year,
        plural: SiteTexts.page.current_locale.years,
      },
      { includeNumber: false },
    ),
  });
}