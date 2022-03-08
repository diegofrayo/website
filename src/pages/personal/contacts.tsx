import ContactsPage from "~/components/pages/personal/[page]/Contacts";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";

export default ContactsPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  callback: async () => {
    const { data: contacts } = await http.post(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
      {
        path: "/assets",
        payload: "contacts",
        source: "firebase",
      },
    );

    return {
      props: {
        contacts,
      },
    };
  },
});
