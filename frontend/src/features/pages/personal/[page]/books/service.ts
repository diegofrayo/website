import http from "~/lib/http";
import { ENV_VARS } from "~/constants";
import {
	sortBy,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/objects-and-arrays";
import type { T_Object } from "~/types";

class BooksService {
	static async fetchBooks(): Promise<T_Book[]> {
		const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
			path: "/data",
			model: "books",
		});

		return data
			.map((book: T_Object) => BookVO(book))
			.sort(sortBy<T_Book>("-addedDate", "-calification", "title"));
	}
}

export default BooksService;

// --- Value objects ---

function BookVO(data: T_Object): T_Book {
	const book = transformObjectKeysFromSnakeCaseToLowerCamelCase<T_Book>(data);

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
