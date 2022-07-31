import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { I18nService } from "~/features/i18n";

dayjs.extend(customParseFormat);

export function getDifferenceBetweenDates(
	startDate: string | Date,
	endDate: string | Date,
): string {
	const translator = I18nService.getInstance();
	const difference = dayjs(endDate).diff(dayjs(startDate, "YYYY/MM/DD"), "day");

	if (difference === 0) {
		return translator.t("page:today");
	}

	if (difference === 1) {
		return translator.t("page:yesterday");
	}

	if (difference < 7) {
		return translator.t("page:days_ago", { number: difference });
	}

	if (difference < 30) {
		return translator.t("page:weeks_ago", { number: Math.round(difference / 7) });
	}

	if (difference < 360) {
		return translator.t("page:months_ago", { number: Math.round(difference / 30) });
	}

	return translator.t("page:years_ago", { number: Math.round(difference / 365) });
}
