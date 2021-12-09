import PersonalPage from "~/components/pages/personal";
import { getPageContentStaticProps } from "~/i18n";

export default PersonalPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({ locale: "es" });
