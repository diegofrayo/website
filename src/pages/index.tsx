import { serialize } from "next-mdx-remote/serialize";

import HomePage from "~/components/pages/home";
import { getPageContentStaticProps } from "~/i18n";
import { ROUTES } from "~/utils/routing";

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.HOME,
  callback: async ({ pageContent }) => {
    return {
      props: {
        mdxContent: await serialize(pageContent?.page?.content),
      },
    };
  },
});
