import { getPageContentStaticProps } from "~/features/i18n";
import TicksPage from "~/features/pages/personal/[page]/Ticks";

export default TicksPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
