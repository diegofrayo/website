import http from "~/lib/http";
import { T_Movie } from "~/types";
import { sortBy } from "~/utils/misc";

class MoviesService {
  async fetchMovies(): Promise<T_Movie[]> {
    const response = await http.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/playground/movies/data.json`,
    );

    return response.data.sort(
      sortBy([
        { param: "calification", order: "desc" },
        { param: "title", order: "asc" },
      ]),
    ) as T_Movie[];
  }
}

export default new MoviesService();
