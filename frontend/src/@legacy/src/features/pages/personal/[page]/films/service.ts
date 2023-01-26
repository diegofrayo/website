import http from "~/@legacy/src/lib/http";
import { ENV_VARS } from "~/@legacy/src/constants";
import {
	sortBy,
	transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/@legacy/src/utils/objects-and-arrays";
import type { T_Object } from "~/@legacy/src/types";

class FilmsService {
	static async fetchFilms(): Promise<T_Film[]> {
		const { data } = await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
			path: "/data",
			model: "films",
		});

		return data
			.map((film: T_Object) => FilmVO(film))
			.sort(sortBy<T_Film>("-addedDate", "-calification", "title"));
	}
}

export default FilmsService;

// --- Value objects ---

function FilmVO(data: T_Object): T_Film {
	const film = transformObjectKeysFromSnakeCaseToLowerCamelCase<T_Film>(data);

	film.categories = film.categories || [];

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
