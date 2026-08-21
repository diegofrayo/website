import type { Metadata } from "next";

import SignInPage from "~/features/pages/sign-in";

// --- METADATA ---

export const metadata: Metadata = {
	title: "Sign in",
	robots: { index: false, follow: false },
};

// --- COMPONENT DEFINITION ---

function SignIn() {
	return <SignInPage />;
}

export default SignIn;
