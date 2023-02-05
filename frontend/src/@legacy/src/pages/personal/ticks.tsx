import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import TicksPage from "~/@legacy/src/features/pages/personal/[page]/Ticks";

export default TicksPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
