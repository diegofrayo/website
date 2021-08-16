import http from "~/lib/http";
import { T_ItemCategory, T_TimeLine } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class TimeLineService {
  async fetchData(): Promise<{ categories: T_ItemCategory[]; items: T_TimeLine[] }> {
    const { categories, items } = (
      await http.get(
        `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/playground/[page]/timeline/data.json`,
      )
    ).data;

    return {
      categories,
      items: items.map((item) => {
        return transformObjectKeysFromSnakeCaseToLowerCamelCase({
          ...item,
          categories: item.categories
            .map((category) => {
              return categories.find((item) => item.id === category);
            })
            .filter(Boolean)
            .sort(sortBy([{ param: "value", order: "asc" }])),
        }) as T_TimeLine;
      }),
    };
  }
}

export default new TimeLineService();
