import { serialize } from "next-mdx-remote/serialize";

import ContactsPage from "~/components/pages/personal/contacts";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";

export default ContactsPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  callback: async () => {
    const { data } = await http.post(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
      {
        path: "/assets",
        payload: `pages/personal/contacts/output.md`,
      },
    );

    return {
      props: {
        mdxOutput: await serialize(data),
      },
    };
  },
});
