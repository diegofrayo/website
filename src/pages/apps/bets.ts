import type { GetStaticProps } from "next";
import dayjs from "dayjs";

import BetsPage from "~/modules/pages/apps/pages/BetsPage";
import type { T_BetsPageProps } from "~/modules/pages/apps/pages/BetsPage";
import { loadData } from "~/server/data-loader";
import { dateWithoutTimezone } from "@diegofrayo/utils/dates";
import { addLeftPadding } from "@diegofrayo/utils/strings";

export default BetsPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps: GetStaticProps<T_BetsPageProps> = async () => {
	const today = dayjs(dateWithoutTimezone());
	const dates = [
		today.toDate(),
		today.add(1, "day").toDate(),
		today.add(2, "day").toDate(),
		today.add(3, "day").toDate(),
		today.subtract(1, "day").toDate(),
		today.subtract(2, "day").toDate(),
		today.subtract(3, "day").toDate(),
	].map((date) => {
		return `${date.getFullYear()}-${addLeftPadding(date.getMonth() + 1)}-${addLeftPadding(
			date.getDate(),
		)}`;
	});
	const data = {} as T_BetsPageProps["data"];

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
