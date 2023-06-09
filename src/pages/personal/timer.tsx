import TimerPage from "~/features/pages/personal/[page]/timer";
import { getPageContentStaticProps } from "~/features/i18n";

export default TimerPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps();
