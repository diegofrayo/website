import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";
import {
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import { isNotUndefined, notExists } from "~/utils/validations";
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
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData(): Promise<T_TimelineFetchResponse> {
    const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
      path: "/assets",
      payload: "pages/personal/[page]/timeline/data.json",
    });

    return this.parseResponse(data);
  }

  parseResponse({ data, categories }: T_TimelineFetchDTO): T_TimelineFetchResponse {
    return {
      categories,
      timeline: Object.values(
        data.reduce((result: T_Object<T_TimelineGroup>, item) => {
          const timelineGroupItemParsed =
            transformObjectKeysFromSnakeCaseToLowerCamelCase<T_TimelineGroupItem>(item);
          const year = timelineGroupItemParsed.startDate.split("/")[0];
          const mutatedResult = { ...result };

          if (notExists(result[year])) {
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
              .filter((c): c is T_TimelineCategory => isNotUndefined(c))
              .sort(sortBy([{ param: "value", order: "asc" }])),
          });
          mutatedResult[year].items.sort(sortBy([{ param: "startDate", order: "desc" }]));

          return mutatedResult;
        }, {}),
      ).sort(sortBy([{ param: "year", order: "desc" }])),
    };
  }
}

export default new TimelineService();
