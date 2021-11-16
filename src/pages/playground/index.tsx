import PlaygroundPage from "~/components/pages/playground";
import { getPageContentStaticProps } from "~/i18n";

export default PlaygroundPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({ locale: "es" });
