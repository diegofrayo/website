import TicksPage from "~/features/pages/personal/[page]/Ticks";
import { getPageContentStaticProps } from "~/features/i18n";

export default TicksPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();
