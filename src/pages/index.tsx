import renderToString from "next-mdx-remote/render-to-string";

import HomePage from "~/components/pages/home";
import { getPageContentStaticProps } from "~/i18n";
import { MDXComponents } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.HOME,
  callback: async ({ pageContent }) => {
    return {
      props: {
        mdxContent: (await renderToString(pageContent?.page?.content, {
          components: MDXComponents,
        })) as string,
      },
    };
  },
});
