import http from "~/lib/http";
import type { T_Timeline } from "./types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class TimelineService {
  async fetchData(): Promise<T_Timeline> {
    const { categories, items } = (
      await http.post(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
        path: "/assets",
        payload: `pages/personal/[page]/timeline/data.json`,
      })
    ).data;

    return {
      categories,
      items: Object.values(
        items
          .map((item) => {
            return transformObjectKeysFromSnakeCaseToLowerCamelCase({
              ...item,
              categories: item.categories
                .map((category) => {
                  return categories.find((item) => item.id === category);
                })
                .filter(Boolean)
                .sort(sortBy([{ param: "value", order: "asc" }])),
            }) as T_Timeline;
          })
          .reduce((result, item) => {
            const year = item.startDate.split("/")[0];

            if (!result[year]) result[year] = { year, items: [] };

            result[year].items.push(item);
            result[year].items = result[year].items.sort(
              sortBy([{ param: "startDate", order: "desc" }]),
            );

            return result;
          }, {}),
      ).sort(sortBy([{ param: "year", order: "desc" }])) as T_Timeline["items"],
    };
  }
}

export default new TimelineService();