import HomePage from "~/components/pages/home";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.HOME,
  callback: async () => {
    return {
      props: {
        data: (
          await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
            path: "/data",
            model: "home",
          })
        ).data,
      },
    };
  },
});
