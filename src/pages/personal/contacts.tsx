import ContactsPage from "~/components/pages/personal/[page]/Contacts";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";

export default ContactsPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  callback: async () => {
    const { data: contacts } = await http.post(
      `${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
      {
        path: "/data",
        model: "contacts",
      },
    );

    return {
      props: {
        contacts,
      },
    };
  },
});
