import { useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import { useDidMount } from "@diegofrayo-pkg/hooks";
import { waitFor } from "@diegofrayo-pkg/utilities/async";

import { Page } from "~/components/layout";
import { Box } from "~/components/primitive";
import { EnvVars, Routes } from "~/constants";
import { AuthService } from "~/features/auth";

function SignInPage() {
	// --- STATES & REFS ---
	const [isAuthTokenValid, setIsAuthTokenValid] = useState<boolean | undefined>();

	// --- STYLES ---
	const classes = {
		container: cn("p-2 text-sm", {
			"text-green-700": isAuthTokenValid === true,
			"text-red-700": isAuthTokenValid === false,
		}),
	};

	// --- UTILS ---
	async function checkAuthToken() {
		if (AuthService.isUserLoggedIn()) {
			window.location.href = Routes.INDEX;
			return;
		}

		const authToken = new URL(window.location.href).searchParams.get("auth_token");
		await waitFor(1, "seconds");

		// NOTE: I know, this is very dumb and unsafe, it's ok for me
		if (authToken === EnvVars.NEXT_PUBLIC_AUTH_TOKEN) {
			setIsAuthTokenValid(true);
			await waitFor(1, "seconds");
			AuthService.createSession();
			window.location.href = Routes.INDEX;
		} else {
			setIsAuthTokenValid(false);
		}
	}

	function getStatusMessage() {
		if (isAuthTokenValid) {
			return "Sign in successfully, redirecting...";
		}

		if (isAuthTokenValid === false) {
			return "Invalid auth token!";
		}

		return "Loading...";
	}

	// --- EFFECTS ---
	useDidMount(() => {
		checkAuthToken();
	});

	return (
		<Page config={{ title: "Sign in" }}>
			<Box className={classes.container}>{getStatusMessage()}</Box>
		</Page>
	);
}

export default SignInPage;
