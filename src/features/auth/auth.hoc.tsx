import type ReactTypes from "@diegofrayo-pkg/types/react";

import { WithAuth } from "./auth.components";

function withAuth<ComponentProps extends object>(
	Component: ReactTypes.FunctionComponent<ComponentProps>,
): ReactTypes.FunctionComponent<ComponentProps> {
	const WithAuthHOC = (props: ComponentProps): ReactTypes.JSXElement => {
		return (
			<WithAuth>
				<Component {...props} />
			</WithAuth>
		);
	};

	return WithAuthHOC;
}

export default withAuth;
