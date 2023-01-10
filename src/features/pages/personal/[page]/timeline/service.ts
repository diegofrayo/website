import autoBind from "auto-bind";

import { ENV_VARS } from "~/constants";
import http from "~/lib/http";
import v from "~/lib/v";
import {
	sortBy,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import type { T_Object } from "~/types";

import type {
	T_TimelineCategory,
	T_TimelineFetchDTO,
	T_TimelineFetchResponse,
	T_TimelineGroup,
	T_TimelineGroupItem,
} from "./types";

class TimelineService {
	constructor() {
		autoBind(this);
	}

	async fetchData(): Promise<T_TimelineFetchResponse> {
		const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
			path: "/data",
			model: "timeline",
		});

		return this.parseResponse(data);
	}

	private parseResponse({ data, categories }: T_TimelineFetchDTO): T_TimelineFetchResponse {
		return {
			categories,
			timeline: Object.values(
				data.reduce((result: T_Object<T_TimelineGroup>, item) => {
					const timelineGroupItemParsed =
						transformObjectKeysFromSnakeCaseToLowerCamelCase<T_TimelineGroupItem>(item);
					const year = timelineGroupItemParsed.startDate.split("/")[0];
					const mutatedResult = { ...result };

					if (v.isUndefined(result[year])) {
						mutatedResult[year] = {
							year: Number(year),
							title: year,
							items: [],
						};
					}

					mutatedResult[year].items.push({
						...timelineGroupItemParsed,
						categories: item.categories
							.map((category): T_TimelineCategory | undefined => {
								return categories.find((c) => c.id === category);
							})
							.filter((category): category is T_TimelineCategory => {
								return v.exists(category);
							})
							.sort(sortBy("value")),
					});
					mutatedResult[year].items.sort(sortBy("-startDate"));

					return mutatedResult;
				}, {}),
			).sort(sortBy("-year")),
		};
	}
}

export default new TimelineService();
