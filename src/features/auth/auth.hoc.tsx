import type ReactTypes from "@diegofrayo-pkg/types/react";

import { WithAuth } from "./auth.components";

function withAuth(Component: ReactTypes.FunctionComponent): () => ReactTypes.JSXElement {
	const WithAuthHOC = (): ReactTypes.JSXElement => {
		return (
			<WithAuth>
				<Component />
			</WithAuth>
		);
	};

	return WithAuthHOC;
}

export default withAuth;
