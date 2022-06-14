import BookmarksPage from "~/components/pages/bookmarks";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";

export default BookmarksPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  callback: async () => ({
    props: {
      bookmarks: (
        await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
          path: "/data",
          model: "bookmarks",
        })
      ).data,
    },
  }),
});
