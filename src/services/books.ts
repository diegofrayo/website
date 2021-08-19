import http from "~/lib/http";
import { T_Book } from "~/types";
import { sortBy } from "~/utils/misc";

class BooksService {
  async fetchBooks(): Promise<T_Book[]> {
    const { data } = await http.post(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/assets`, {
      file: `pages/playground/[page]/books/data.json`,
    });

    return data.sort(
      sortBy([
        { param: "calification", order: "desc" },
        { param: "title", order: "asc" },
      ]),
    ) as T_Book[];
  }
}

export default new BooksService();
