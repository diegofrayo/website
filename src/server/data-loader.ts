import fs from "fs";

import EnvVars from "~/modules/env-vars";
import { isProductionEnvironment } from "~/utils/app";
import v from "@diegofrayo/v";
import FirebaseService from "@diegofrayo/utils/database";
import type DR from "@diegofrayo/types";

type T_LoadPageContentParams = {
	page: "home" | "resume" | "blog";
	lang?: "en";
};

export async function loadPageContent({ page, lang = "en" }: T_LoadPageContentParams) {
	const pageContent = JSON.parse(
		fs.readFileSync(`./src/data/${page}/content.json`, "utf-8"),
	) as T_RawPageContent;

	return { ...pageContent, content: pageContent.content[lang] };
}

export async function loadData<G_Data>(
	config:
		| { page: T_LoadPageContentParams["page"]; remotePath?: string }
		| { fullPath: string; remotePath?: string },
) {
	if (isProductionEnvironment(EnvVars) && v.isString(config.remotePath)) {
		return (await FirebaseService.get(config.remotePath)) as G_Data;
	}

	const data = JSON.parse(
		fs.readFileSync(
			"fullPath" in config ? config.fullPath : `./src/data/${config.page}/data.json`,
			"utf-8",
		),
	);

	return data as G_Data;
}

// --- TYPES ---

type T_RawPageContent = {
	config: {
		locales: Array<"en">;
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
