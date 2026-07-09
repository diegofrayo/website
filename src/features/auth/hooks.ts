import { useState } from "react";

import { useDidMount } from "@diegofrayo-pkg/hooks";

import { AuthService } from "./service";

export function useAuth() {
	const [isSessionLoaded, setIsSessionLoaded] = useState(false);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

	useDidMount(() => {
		AuthService.onLoadSession((isUserLoggedIn) => {
			setIsSessionLoaded(true);
			setIsUserLoggedIn(isUserLoggedIn);
		});
		AuthService.loadSession();
	});

	return { isSessionLoaded, isUserLoggedIn };
}
