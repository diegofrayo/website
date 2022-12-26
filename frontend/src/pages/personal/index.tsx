import PersonalPage from "~/features/pages/personal";
import { getPageContentStaticProps } from "~/features/i18n";

export default PersonalPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
