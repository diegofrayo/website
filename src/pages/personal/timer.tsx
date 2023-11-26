import TimerPage from "~/features/pages/personal/[page]/timer";
import getPageContentStaticProps from "~/features/i18n/server";

export default TimerPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps();
