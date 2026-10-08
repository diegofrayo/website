import { useIsClient } from "@diegofrayo-pkg/hooks";

import type ReactTypes from "../types/react";

function withRenderInBrowser<ComponentProps extends object>(
	Component: ReactTypes.FunctionComponent<ComponentProps>,
): ReactTypes.FunctionComponent<ComponentProps> {
	function RenderInBrowserComponent(props: ComponentProps): ReactTypes.JSXElementNullable {
		const isClient = useIsClient();

		if (!isClient) return null;

		return <Component {...props} />;
	}

	RenderInBrowserComponent.displayName = `withRenderInBrowser(${
		Component.displayName || Component.name || "Component"
	})`;

	return RenderInBrowserComponent;
}

export default withRenderInBrowser;
