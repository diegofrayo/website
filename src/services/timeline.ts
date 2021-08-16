import http from "~/lib/http";
import { T_TimeLine } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class TimeLineService {
  async fetchData(): Promise<T_TimeLine> {
    const { categories, items } = (
      await http.get(
        `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/playground/[page]/timeline/data.json`,
      )
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
            }) as T_TimeLine;
          })
          .reduce((result, item) => {
            const year = item.startDate.split("/")[0];

            if (!result[year]) result[year] = { year, items: [] };

            result[year].items.push(item);

            return result;
          }, {}),
      ),
    };
  }
}

export default new TimeLineService();
