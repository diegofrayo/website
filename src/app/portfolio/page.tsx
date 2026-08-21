import type { Metadata } from "next";

import { ASSETS_ROOT_PATH, WEBSITE_METADATA } from "~/constants";
import PortfolioPage from "~/features/pages/portfolio";

// --- METADATA ---

export const metadata: Metadata = {
	title: "Portfolio",
	description: "A showcase of my work and experience.",
	alternates: { canonical: "/portfolio" },
	openGraph: {
		type: "article",
		url: "/portfolio",
		siteName: WEBSITE_METADATA.title,
		images: `${ASSETS_ROOT_PATH}/meta-og-image.png`,
	},
};

// --- COMPONENT DEFINITION ---

function Portfolio() {
	return <PortfolioPage />;
}

export default Portfolio;
