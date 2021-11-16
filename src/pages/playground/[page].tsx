import { GetStaticPaths } from "next";

import PlaygroundPage, { T_PageProps } from "~/components/pages/playground/[page]";
import { getPageContentStaticProps } from "~/i18n";
import { PLAYGROUND_PAGES } from "~/utils/constants";

export default PlaygroundPage;

// --- Next.js functions ---

export const getStaticPaths: GetStaticPaths<T_PageProps> = async function getStaticPaths() {
  return {
    paths: PLAYGROUND_PAGES.map((page) => {
      return { params: { page: page.slug } };
    }),
    fallback: false,
  };
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, T_PageProps>({
  locale: "es",
  callback: async ({ params }) => {
    return {
      props: {
        page: params.page,
      },
    };
  },
});
