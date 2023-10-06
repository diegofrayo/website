import DR from "@diegofrayo/types";
import fs from "fs";

type T_LoadPageContentParams = {
	page: "home" | "resume" | "blog";
	lang?: "en";
};

export async function loadPageContent({ page, lang = "en" }: T_LoadPageContentParams) {
	const pageContent = JSON.parse(
		fs.readFileSync(`./src/data/generated/${page}/content.json`, "utf-8"),
	) as T_RawPageContent;

	return { ...pageContent, content: pageContent.content[lang] };
}

export async function loadData<G_Data>(
	config: Pick<T_LoadPageContentParams, "page"> | { fullPath: string },
) {
	const data = JSON.parse(
		fs.readFileSync(
			"fullPath" in config ? config.fullPath : `./src/data/generated/${config.page}/data.json`,
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
