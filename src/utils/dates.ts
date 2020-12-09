import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { pluralize } from "./misc";

dayjs.extend(customParseFormat);

export function getDifferenceBetweenDates(startDate: string, endDate: Date): string {
  const difference = dayjs(endDate).diff(dayjs(startDate, "YYYY/MM/DD"), "day");

  if (difference === 0) {
    return "hoy";
  }

  if (difference === 1) {
    return "ayer";
  }

  if (difference < 30) {
    return `hace ${difference} días`;
  }

  if (difference < 365) {
    return `hace ${pluralize(Math.round(difference / 30), {
      singular: "mes",
      plural: "meses",
    })}`;
  }

  return `hace ${pluralize(Math.round(difference / 365), "año")}`;
}
