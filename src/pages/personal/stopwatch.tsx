import getPageContentStaticProps from "~/features/i18n/server";
import StopwatchPage from "~/features/pages/personal/[page]/Stopwatch";

export default StopwatchPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps();
