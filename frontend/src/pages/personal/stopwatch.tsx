import { getPageContentStaticProps } from "~/features/i18n";
import StopwatchPage from "~/features/pages/personal/[page]/Stopwatch";

export default StopwatchPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
