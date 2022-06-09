import ResumePage from "~/components/pages/resume";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { ROUTES } from "~/utils/routing";

export default ResumePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.RESUME,
  callback: async () => {
    const { data: resume } = await http.post(
      `${process.env["NEXT_PUBLIC_ASSETS_SERVER_URL"]}/api/diegofrayo`,
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
