import http from "~/lib/http";
import {
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import type { T_UnknownObject } from "~/types";
import { ENV_VARS } from "~/utils/constants";

class BooksService {
  async fetchBooks(): Promise<T_Book[]> {
    const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
      path: "/assets",
      payload: "pages/personal/[page]/books/data.json",
    });

    return data
      .map((book: T_UnknownObject) => BookVO(book))
      .sort(
        sortBy([
          { param: "addedDate", order: "desc" },
          { param: "calification", order: "desc" },
          { param: "title", order: "asc" },
        ]),
      );
  }
}

export default new BooksService();

// --- Value objects ---

// TODO: Validate scheme using a library and infer its types
function BookVO(data: T_UnknownObject): T_Book {
  const book = transformObjectKeysFromSnakeCaseToLowerCamelCase(data) as T_Book;

  return book;
}

// --- Types ---

export type T_Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  calification: number;
  addedDate: string;
  url: string;
  cover: string;
  isPublic: boolean;
};
