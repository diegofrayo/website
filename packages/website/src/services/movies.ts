import Data from "~/data/movies.json";
import { T_Movie } from "~/types";
import { sortBy } from "~/utils/misc";

class MoviesService {
  async fetchMovies(): Promise<T_Movie[]> {
    return Data.sort(
      sortBy([
        { param: "calification", order: "desc" },
        { param: "title", order: "asc" },
      ]),
    ) as T_Movie[];
  }
}

export default new MoviesService();
