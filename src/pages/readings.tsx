import ReadingsPage from "~/components/pages/readings";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";

export default ReadingsPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  callback: async () => ({
    props: {
      readings: (
        await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
          path: "/data",
          model: "readings",
        })
      ).data,
    },
  }),
});
