import type { GetStaticProps } from "next";
import dayjs from "dayjs";

import BetsPage from "~/modules/pages/apps/pages/BetsPage";
import type { T_BetsPageProps } from "~/modules/pages/apps/pages/BetsPage";
import { loadData } from "~/server/data-loader";
import { isDevelopmentEnvironment } from "~/utils/app";
import { dateWithoutTimezone } from "@diegofrayo/utils/dates";
import { addLeftPadding } from "@diegofrayo/utils/strings";

export default BetsPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_BetsPageProps> = async () => {
	const monday = dayjs(dateWithoutTimezone(new Date(2024, 4, 13)));
	const dates = (
		dateWithoutTimezone().getDay() >= 2 && dateWithoutTimezone().getDay() <= 4
			? [
					monday.add(1, "day").toDate(),
					monday.add(2, "day").toDate(),
					monday.add(3, "day").toDate(),
			  ]
			: [
					monday.add(4, "day").toDate(),
					monday.add(5, "day").toDate(),
					monday.add(6, "day").toDate(),
					monday.add(7, "day").toDate(),
			  ]
	).map((date) => {
		// TODO: Weird issue related to getDate()
		return `${date.getFullYear()}-${addLeftPadding(date.getMonth() + 1)}-${addLeftPadding(
			date.getDate() + (isDevelopmentEnvironment() ? 1 : 0),
		)}`;
	});
	const data = {} as T_BetsPageProps["data"];

	// TODO: Remove these lines
	// console.log("monday", monday.toDate());
	// console.log("dateWithoutTimezone", dateWithoutTimezone());
	// console.log("getDay", dateWithoutTimezone().getDay());
	// console.log("dates", [
	// 	monday.toDate(),
	// 	monday.add(1, "day").toDate(),
	// 	monday.add(2, "day").toDate(),
	// 	monday.add(3, "day").toDate(),
	// ]);
	// console.log("dates-transformed", dates);

	// eslint-disable-next-line no-loops/no-loops, no-restricted-syntax
	for (const date of dates) {
		try {
			// eslint-disable-next-line no-await-in-loop
			data[date] = await loadData<T_BetsPageProps["data"][number]>({
				localPath: `apps/bets/${date}.json`,
				remote: false,
			});
		} catch (error) {
			console.log(`Data not found "${date}"`);
		}
	}

	return {
		props: {
			data,
		},
	};
};
