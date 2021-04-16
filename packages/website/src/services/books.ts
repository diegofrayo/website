import Data from "~/data/books.json";
import { T_Book } from "~/types";
import { sortBy } from "~/utils/misc";

class BooksService {
  async fetchBooks(): Promise<T_Book[]> {
    return Data.books.sort(
      sortBy([
        { param: "calification", order: "desc" },
        { param: "title", order: "asc" },
      ]),
    ) as T_Book[];
  }
}

export default new BooksService();
