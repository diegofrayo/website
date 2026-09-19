import type { Metadata } from "next";

import type ReactTypes from "@diegofrayo-pkg/types/react";

import ErrorPage from "~/features/pages/error.page";

// --- METADATA ---

export const metadata: Metadata = {
	title: "Page not found",
	robots: { index: false, follow: false },
};

// --- COMPONENT DEFINITION ---

function NotFound(): ReactTypes.JSXElement {
	return <ErrorPage variant="404" />;
}

export default NotFound;
