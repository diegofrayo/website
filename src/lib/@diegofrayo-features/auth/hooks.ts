import { useState } from "react";

import { useDidMount } from "@diegofrayo-pkg/hooks";

import { AuthService } from "./service";

export function useAuth() {
	const [isSessionLoaded, setIsSessionLoaded] = useState(false);

	useDidMount(() => {
		AuthService.onLoadSession(() => setIsSessionLoaded(true));
		AuthService.loadSession();
	});

	return { isSessionLoaded };
}
