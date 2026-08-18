import type ReactTypes from "@diegofrayo-pkg/types/react";

import { WithAuth } from "./auth.components";

function withAuth(Component: ReactTypes.FunctionComponent) {
	const WithAuthHOC = () => {
		return (
			<WithAuth>
				<Component />
			</WithAuth>
		);
	};

	return WithAuthHOC;
}

export default withAuth;
