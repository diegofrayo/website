import ResumePage from "~/components/pages/resume";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

export default ResumePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.RESUME,
  callback: async () => {
    const { data: resume } = await http.post(
      `${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
      {
        path: "/assets",
        payload: "resume",
        source: "firebase",
      },
    );

    return {
      props: {
        resume,
      },
    };
  },
});
