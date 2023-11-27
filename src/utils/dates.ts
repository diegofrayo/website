import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { addLeftPadding } from "@diegofrayo/utils/strings";

dayjs.extend(customParseFormat);

export function generateDate(): string {
	const date = new Date();

	return `${date.getFullYear()}/${addLeftPadding(date.getMonth() + 1)}/${addLeftPadding(
		date.getDate(),
	)}`;
}

export function getDatesDiff(startDate: Date, endDate: Date, format: "minute" | "year"): number {
	return dayjs(endDate).diff(dayjs(startDate), format);
}
