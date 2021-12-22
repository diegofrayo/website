import { AuthService } from "~/auth";
import http from "~/lib/http";
import type { T_Film } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class FilmsService {
  async fetchFilms(): Promise<T_Film[]> {
    const { data } = await http.post(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
      {
        path: "/assets",
        payload: `pages/personal/[page]/films/data.json`,
      },
    );

    return data
      .map(transformObjectKeysFromSnakeCaseToLowerCamelCase)
      .sort(
        sortBy([
          { param: "addedDate", order: "desc" },
          { param: "calification", order: "desc" },
          { param: "title", order: "asc" },
        ]),
      )
      .filter((film) => {
        return film.isPublic || (!film.isPublic && AuthService.isUserLoggedIn());
      }) as T_Film[];
  }
}

export default new FilmsService();
