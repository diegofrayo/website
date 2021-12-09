import { AuthService } from "~/auth";
import http from "~/lib/http";
import { T_Book } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class BooksService {
  async fetchBooks(): Promise<T_Book[]> {
    const { data } = await http.post(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/assets`, {
      file: `pages/personal/[page]/books/data.json`,
    });

    return data
      .map(transformObjectKeysFromSnakeCaseToLowerCamelCase)
      .sort(
        sortBy([
          { param: "addedDate", order: "desc" },
          { param: "calification", order: "desc" },
          { param: "title", order: "asc" },
        ]),
      )
      .filter((book) => {
        return book.isPublic || (!book.isPublic && AuthService.isUserLoggedIn());
      }) as T_Book[];
  }
}

export default new BooksService();
