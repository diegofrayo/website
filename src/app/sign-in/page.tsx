import type { Metadata } from "next";

import type ReactTypes from "@diegofrayo-pkg/types/react";

import SignInPage from "~/features/pages/sign-in";

// --- METADATA ---

export const metadata: Metadata = {
	title: "Sign in",
	robots: { index: false, follow: false },
};

// --- COMPONENT DEFINITION ---

function SignIn(): ReactTypes.JSXElement {
	return <SignInPage />;
}

export default SignIn;
