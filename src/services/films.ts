import http from "~/lib/http";
import { T_Film } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class FilmsService {
  async fetchFilms(): Promise<T_Film[]> {
    const response = await http.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/playground/films/data.json`,
    );

    return response.data.map(transformObjectKeysFromSnakeCaseToLowerCamelCase).sort(
      sortBy([
        { param: "calification", order: "desc" },
        { param: "title", order: "asc" },
      ]),
    ) as T_Film[];
  }
}

export default new FilmsService();