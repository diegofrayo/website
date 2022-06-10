import { GetStaticPaths } from "next";

import PersonalPage, { T_PageProps } from "~/components/pages/personal/[page]";
import { getPageContentStaticProps } from "~/i18n";
import { PERSONAL_PAGES } from "~/utils/constants";
import { isNotEmptyString } from "~/utils/validations";

export default PersonalPage;

// --- Next.js functions ---

export const getStaticPaths: GetStaticPaths<T_PageProps> = async function getStaticPaths() {
  return {
    paths: PERSONAL_PAGES.filter((page) => isNotEmptyString(page.componentName)).map((page) => {
      return {
        params: { page: page.slug },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, T_PageProps>({
  callback: async ({ params }) => {
    return {
      props: {
        page: params.page,
      },
    };
  },
});
