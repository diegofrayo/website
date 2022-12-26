import TimerPage from "~/features/pages/personal/[page]/timer";
import { getPageContentStaticProps } from "~/features/i18n";

export default TimerPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
