import { useState } from "react";

import { useDidMount } from "@diegofrayo-pkg/hooks";

import AuthService from "./service";

function useAuth() {
	const [isSessionLoaded, setIsSessionLoaded] = useState(false);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

	useDidMount(() => {
		AuthService.onSessionLoad((isUserLoggedIn) => {
			setIsSessionLoaded(true);
			setIsUserLoggedIn(isUserLoggedIn);
		});
	});

	return { isSessionLoaded, isUserLoggedIn };
}

export default useAuth;
