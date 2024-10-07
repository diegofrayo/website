import { useDidMount } from "@diegofrayo/hooks";
import * as React from "react";
import AuthService from "./service";

function useAuth() {
	const [isSessionLoaded, setIsSessionLoaded] = React.useState(false);

	useDidMount(() => {
		AuthService.onLoadSession(() => {
			setIsSessionLoaded(true);
		});

		AuthService.loadSession();
	});

	return {
		isSessionLoaded,
	};
}

export default useAuth;
