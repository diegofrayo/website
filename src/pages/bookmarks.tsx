import BookmarksPage from "~/components/pages/bookmarks";
import { getPageContentStaticProps } from "~/i18n";
import { dataLoader } from "~/server";

export default BookmarksPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  callback: async () => {
    return {
      props: {
        bookmarks: await dataLoader({
          path: "/pages/bookmarks/data.json",
        }),
      },
    };
  },
});
