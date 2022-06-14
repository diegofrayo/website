import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";
import {
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import type { T_UnknownObject } from "~/types";

class FilmsService {
  async fetchFilms(): Promise<T_Film[]> {
    const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
      path: "/data",
      model: "films",
    });

    return data
      .map((film: T_UnknownObject) => FilmVO(film))
      .sort(
        sortBy([
          { param: "addedDate", order: "desc" },
          { param: "calification", order: "desc" },
          { param: "title", order: "asc" },
        ]),
      );
  }
}

export default new FilmsService();

// --- Value objects ---

// TODO: Validate scheme using a library and infer its types
function FilmVO(data: T_UnknownObject): T_Film {
  const film = transformObjectKeysFromSnakeCaseToLowerCamelCase<T_Film>(data);

  return film;
}

// --- Types ---

export type T_Film = {
  id: string;
  title: string;
  type: "Serie" | "Película" | "Documental" | "Serie documental";
  source: "Netflix" | "YouTube" | "imdb" | "Amazon Prime Video";
  categories: string[];
  calification: number;
  cover: string;
  addedDate: string;
  isPublic: boolean;
};
