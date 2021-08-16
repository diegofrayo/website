import http from "~/lib/http";
import { T_Book } from "~/types";
import { sortBy } from "~/utils/misc";

class BooksService {
  async fetchBooks(): Promise<T_Book[]> {
    const response = await http.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/playground/[page]/books/data.json`,
    );

    return response.data.sort(
      sortBy([
        { param: "calification", order: "desc" },
        { param: "title", order: "asc" },
      ]),
    ) as T_Book[];
  }
}

export default new BooksService();
