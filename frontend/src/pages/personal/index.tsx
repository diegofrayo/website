import PersonalPage from "~/@legacy/src/features/pages/personal";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";

export default PersonalPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
