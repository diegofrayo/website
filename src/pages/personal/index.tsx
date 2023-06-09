import PersonalPage from "~/features/pages/personal";
import { getPageContentStaticProps } from "~/features/i18n";

export default PersonalPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps();
