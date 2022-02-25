import TimerPage from "~/components/pages/personal/[page]/timer";
import { getPageContentStaticProps } from "~/i18n";

export default TimerPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
