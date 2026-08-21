"use client";

import { useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import { useDidMount } from "@diegofrayo-pkg/hooks";
import { waitFor } from "@diegofrayo-pkg/utilities/async";

import { Box } from "~/components/primitive";
import AuthService from "~/features/auth";
import { Routes } from "~/features/routing";

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
	async function signIn() {
		try {
			const authToken = new URL(window.location.href).searchParams.get("auth_token");

			if (!authToken) throw new Error("Invalid auth token!");

			await AuthService.signIn(authToken);
			setIsAuthTokenValid(true);
			await waitFor(1, "seconds");

			window.location.href = Routes.INDEX;
		} catch (error) {
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
		AuthService.onSessionLoad((isUserLoggedIn: boolean) => {
			if (isUserLoggedIn) {
				window.location.href = Routes.INDEX;
				return;
			}

			signIn();
		});
	});

	return <Box className={classes.container}>{getStatusMessage()}</Box>;
}

export default SignInPage;
