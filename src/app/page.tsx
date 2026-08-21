import type { Metadata } from "next";

import { PersonScript } from "~/components/common";
import { ASSETS_ROOT_PATH, WEBSITE_METADATA } from "~/constants";
import HomePage from "~/features/pages/index";

// --- METADATA ---

export const metadata: Metadata = {
	description:
		"I'm a Software Developer. Focused on JavaScript, TypeScript, React, Next.js, Tailwind CSS, and Node.js",
	alternates: { canonical: "/" },
	openGraph: {
		type: "article",
		url: "/",
		siteName: WEBSITE_METADATA.title,
		images: `${ASSETS_ROOT_PATH}/meta-og-image.png`,
	},
};

// --- COMPONENT DEFINITION ---

function Home() {
	return (
		<>
			<PersonScript />
			<HomePage />
		</>
	);
}

export default Home;
