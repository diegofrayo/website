import fs from "fs";
import path from "path";

import EnvVars from "~/modules/env-vars";
import { isProductionEnvironment } from "~/utils/app";
import type DR from "@diegofrayo/types";
import DatabaseService from "@diegofrayo/utils/database";
import v from "@diegofrayo/v";

type T_LoadPageContentParams = {
	page: "home" | "resume" | "blog" | "businesses" | "contacts" | "timeline" | "films" | "books";
	lang?: "en";
};

export async function loadPageContent({ page, lang = "en" }: T_LoadPageContentParams) {
	const pageContent = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), `src/data/${page}/content.json`), "utf-8"),
	) as T_RawPageContent;

	return { ...pageContent, content: pageContent.content[lang] };
}

export async function loadData<G_Data>(
	config:
		| { page: T_LoadPageContentParams["page"]; remote?: boolean }
		| { localPath: string; remotePath?: string },
) {
	if ("page" in config) {
		const data =
			isProductionEnvironment(EnvVars) && config.remote
				? await DatabaseService.get(config.page)
				: JSON.parse(
						fs.readFileSync(
							path.join(process.cwd(), `src/data/_local_/${config.page}/data.json`),
							"utf-8",
						),
				  );
		return data as G_Data;
	}

	const data =
		isProductionEnvironment(EnvVars) && v.isString(config.remotePath)
			? await DatabaseService.get(config.remotePath)
			: JSON.parse(
					fs.readFileSync(path.join(process.cwd(), `src/data/${config.localPath}`), "utf-8"),
			  );

	return data as G_Data;
}

// --- TYPES ---

type T_RawPageContent = {
	config: {
		locales: "en"[];
		default_locale: "en";
		is_seo_enabled: boolean;
		pathname: string;
	};
	content: {
		en: {
			seo: {
				title: string;
				description: string;
			};
			texts: DR.Object<string>;
		};
		es: {
			seo: {
				title: string;
				description: string;
			};
			texts: DR.Object<string>;
		};
	};
};

export type T_PageContent = {
	config: T_RawPageContent["config"];
	content: T_RawPageContent["content"]["en"];
};
