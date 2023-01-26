import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import StopwatchPage from "~/@legacy/src/features/pages/personal/[page]/Stopwatch";

export default StopwatchPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
