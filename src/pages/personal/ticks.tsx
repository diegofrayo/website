import getPageContentStaticProps from "~/features/i18n/server";
import TicksPage from "~/features/pages/personal/[page]/Ticks";

export default TicksPage;

// --- NEXT.JS FUNCTIONS ---

export const getStaticProps = getPageContentStaticProps();
