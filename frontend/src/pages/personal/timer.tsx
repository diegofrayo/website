import TimerPage from "~/@legacy/src/features/pages/personal/[page]/timer";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";

export default TimerPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
