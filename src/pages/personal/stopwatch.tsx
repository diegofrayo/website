import { getPageContentStaticProps } from "~/features/i18n";
import StopwatchPage from "~/features/pages/personal/[page]/Stopwatch";

export default StopwatchPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps();
