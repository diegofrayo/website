import type ReactTypes from "@diegofrayo-pkg/types/react";

import useAuth from "./hook";

type WithAuthProps = {
	children: ReactTypes.Children;
};

export function WithAuth({ children }: WithAuthProps) {
	const { isUserLoggedIn } = useAuth();

	if (isUserLoggedIn) {
		return children;
	}

	return null;
}
