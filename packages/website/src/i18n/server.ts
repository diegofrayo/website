import http from "~/lib/http";
import { T_Locale, T_Object, T_PageContent, T_PageRoute } from "~/types";

type T_DefaultPageProps = {
  pageContent: T_PageContent;
  locale: T_Locale;
};

type T_GetStaticProps<G_Params> = {
  locale: T_Locale;
  params: G_Params;
};

type T_GetPageContentStaticProps<G_PageProps, G_GetStaticPropsParams> = {
  page: T_PageRoute | ((params: T_GetStaticProps<G_GetStaticPropsParams>) => T_PageRoute);
  callback?: (
    parameters: T_GetStaticProps<G_GetStaticPropsParams> & { pageContent: T_PageContent },
  ) => Promise<{ props: G_PageProps }>;
};

export default function getPageContentStaticProps<G_PageProps, G_GetStaticPropsParams>({
  page,
  callback = () => Promise.resolve({ props: {} as G_PageProps }),
}: T_GetPageContentStaticProps<G_PageProps, G_GetStaticPropsParams>): any {
  async function getStaticProps(
    parameters: T_GetStaticProps<G_GetStaticPropsParams>,
  ): Promise<{ props: T_DefaultPageProps & G_PageProps }> {
    const locale = parameters.locale as T_Locale;
    const pageContent = await fetchPageContent({
      page: typeof page === "function" ? page(parameters) : page,
      locale,
    });

    return {
      props: {
        pageContent,
        locale,
        ...(await callback({ ...parameters, pageContent })).props,
      },
    };
  }

  return getStaticProps;
}

type T_GetContentParams = {
  page?: string;
  locale?: T_Locale;
};

// --- Utils ---

async function fetchPageContent({
  page = "",
  locale = this.DEFAULT_LOCALE,
}: T_GetContentParams): Promise<T_PageContent> {
  const [layoutContent, pageContent] = await Promise.all([readFile(""), readFile(page)]);
  const response = {
    seo: {},
    page: { config: {}, common: {} },
    layout: {},
    common: {},
  };

  if (page) {
    response.seo = pageContent[locale].seo || {};
    response.page = pageContent[locale].texts || {};
    response.page.common = pageContent.common || {};
    response.page.config = pageContent.config || {};
  }

  response.layout = Object.entries(layoutContent.layout).reduce(
    (result, [key, value]: [string, T_Object]) => {
      return { ...result, [key]: value[locale] };
    },
    {},
  );

  response.common = layoutContent.common[locale];

  return response;
}

async function readFile(page) {
  const response = await http.get(
    `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/${
      page ? "pages" + (page === "/" ? "/home" : page) + "/" : ""
    }content.json`,
  );

  return response.data;
}