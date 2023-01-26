// @ts-nocheck

import http from "~/@legacy/src/lib/http";
import type { T_Object } from "~/@legacy/src/types";
import { ROUTES, T_RoutesValues } from "~/@legacy/src/features/routing";

import I18nService from "./service";
import { T_Locale, T_PageContent } from "./types";

type T_DefaultPageProps = {
	pageContent: T_PageContent;
	locale: T_Locale;
};

type T_GetStaticProps<G_Params> = {
	locale: T_Locale;
	params: G_Params;
};

type T_GetPageContentStaticProps<G_PageProps, G_GetStaticPropsParams> = {
	page?:
		| T_RoutesValues
		| T_RoutesValues[]
		| ((params: T_GetStaticProps<G_GetStaticPropsParams>) => T_RoutesValues);
	callback?: (
		parameters: T_GetStaticProps<G_GetStaticPropsParams> & { pageContent: T_PageContent },
	) => Promise<{
		props?: G_PageProps;
		revalidate?: number;
		redirect?: { destination: string; permanent: boolean };
	}>;
	localesExtractor?: (data: G_PageProps) => T_Locale[];
	locale?: T_Locale;
};

export default function getPageContentStaticProps<G_PageProps, G_GetStaticPropsParams>(
	config?: T_GetPageContentStaticProps<G_PageProps, G_GetStaticPropsParams>,
): any {
	const {
		page,
		callback = () => Promise.resolve({ props: {} as G_PageProps, revalidate: undefined }),
		localesExtractor,
		locale,
	} = config || {};

	async function getStaticProps(parameters: T_GetStaticProps<G_GetStaticPropsParams>): Promise<{
		notFound?: boolean;
		revalidate?: number;
		props?: T_DefaultPageProps & G_PageProps;
		redirect?: { destination: string; permanent: boolean };
	}> {
		try {
			const pageLocale =
				locale || (parameters.locale as T_Locale) || I18nService.getDefaultLocale();
			const pageContent = await fetchPageContent({
				page: typeof page === "function" ? page(parameters) : page,
				locale: pageLocale,
			});
			const {
				props: pageProps,
				revalidate,
				notFound,
			} = await callback({ ...parameters, pageContent });

			return {
				notFound:
					notFound ||
					(
						(localesExtractor
							? localesExtractor(pageProps)
							: pageContent.page?.config?.locales) || [pageLocale]
					).indexOf(pageLocale) === -1,
				props: {
					pageContent,
					locale: pageLocale,
					...pageProps,
				},
				revalidate,
			};
		} catch (error) {
			console.log("getPageContentStaticProps => Error");
			console.log(error);

			return {
				redirect: {
					destination: "/500",
					permanent: false,
				},
			};
		}
	}

	return getStaticProps;
}

// --- Utils ---

type T_GetContentParams = {
	page?: string | string[];
	locale?: T_Locale;
};

async function fetchPageContent({
	page = "",
	locale = I18nService.getDefaultLocale(),
}: T_GetContentParams): Promise<T_PageContent> {
	const [layoutContent, ...pagesContent] = await Promise.all(
		[readFile("")].concat(
			!page ? [] : Array.isArray(page) ? page.map((item) => readFile(item)) : [readFile(page)],
		),
	);
	const response = {
		seo: {},
		page: { config: {}, common: {} },
		layout: {},
		common: {},
	};

	if (page) {
		const pageContent = pagesContent.reduce((result, current) => {
			return {
				config: {
					...result.config,
					...current.config,
				},
				[locale]: {
					seo: {
						...result[locale]?.seo,
						...current[locale]?.seo,
					},
					texts: {
						...result[locale]?.texts,
						...current[locale]?.texts,
					},
				},
			};
		});

		response.seo = pageContent[locale]?.seo || {};
		response.page = pageContent[locale]?.texts || {};
		response.page.common = pageContent.common || {};
		response.page.config = pageContent.config || {};
	}

	response.layout = Object.entries(layoutContent.layout).reduce(
		(result, [key, value]: [string, T_Object]) => {
			return {
				...result,
				[key]: {
					...value[locale],
					common: value.common || {},
				},
			};
		},
		{},
	);

	response.common = layoutContent.common[locale];

	return response;
}

async function readFile(page) {
	const { data } = await http.get(
		`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/${
			page ? `pages${page === ROUTES.HOME ? "/home" : page}/` : ""
		}content.json`,
	);

	return data;
}
