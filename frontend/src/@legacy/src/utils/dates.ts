import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { I18nService } from "~/@legacy/src/features/i18n";

import { addLeftPadding } from "./formatting";

dayjs.extend(customParseFormat);

export function generateDate(): string {
	const date = new Date();

	return `${date.getFullYear()}/${addLeftPadding(date.getMonth() + 1)}/${addLeftPadding(
		date.getDate(),
	)}`;
}

export function getFormattedDatesDifference(
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

export function getDatesDiff(startDate: Date, endDate: Date, format: "minute" | "year"): number {
	return dayjs(endDate).diff(dayjs(startDate), format);
}