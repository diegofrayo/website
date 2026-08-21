import type { Metadata } from "next";

import ErrorPage from "~/features/pages/error.page";

// --- METADATA ---

export const metadata: Metadata = {
	title: "Page not found",
	robots: { index: false, follow: false },
};

// --- COMPONENT DEFINITION ---

function NotFound() {
	return <ErrorPage variant="404" />;
}

export default NotFound;
