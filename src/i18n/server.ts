import http from "~/lib/http";
import { T_Locale, T_Object, T_PageContent, T_PageRoute } from "~/types";
import { ROUTES } from "~/utils/routing";

import I18nService from "./service";

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
    | T_PageRoute
    | T_PageRoute[]
    | ((params: T_GetStaticProps<G_GetStaticPropsParams>) => T_PageRoute);
  callback?: (
    parameters: T_GetStaticProps<G_GetStaticPropsParams> & { pageContent: T_PageContent },
  ) => Promise<{ props: G_PageProps }>;
  localesExtractor?: (data: G_PageProps) => T_Locale[];
  locale?: T_Locale;
};

export default function getPageContentStaticProps<G_PageProps, G_GetStaticPropsParams>(
  config?: T_GetPageContentStaticProps<G_PageProps, G_GetStaticPropsParams>,
): any {
  const {
    page,
    callback = () => Promise.resolve({ props: {} as G_PageProps }),
    localesExtractor,
    locale,
  } = config || {};

  async function getStaticProps(
    parameters: T_GetStaticProps<G_GetStaticPropsParams>,
  ): Promise<{ notFound: boolean; props: T_DefaultPageProps & G_PageProps }> {
    const pageLocale = locale || (parameters.locale as T_Locale);
    const pageContent = await fetchPageContent({
      page: typeof page === "function" ? page(parameters) : page,
      locale: pageLocale,
    });
    const pageProps = (await callback({ ...parameters, pageContent })).props;

    return {
      notFound:
        (
          (localesExtractor ? localesExtractor(pageProps) : pageContent.page?.config?.locales) || [
            pageLocale || I18nService.getDefaultLocale(),
          ]
        ).indexOf(pageLocale) === -1,
      props: {
        pageContent,
        locale: pageLocale,
        ...pageProps,
      },
    };
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
  locale = this.DEFAULT_LOCALE,
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
      page ? "pages" + (page === ROUTES.HOME ? "/home" : page) + "/" : ""
    }content.json`,
  );

  return data;
}
