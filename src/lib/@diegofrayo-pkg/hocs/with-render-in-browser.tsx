import { useDidMountValue } from "@diegofrayo-pkg/hooks";

import type ReactTypes from "../types/react";

function withRenderInBrowser<ComponentProps extends object>(
	Component: ReactTypes.FunctionComponent<ComponentProps>,
): ReactTypes.FunctionComponent<ComponentProps> {
	function RenderInBrowserComponent(props: ComponentProps): ReactTypes.JSXElementNullable {
		const isMounted = useDidMountValue({ getSnapshot });

		if (!isMounted) return null;

		return <Component {...props} />;
	}

	RenderInBrowserComponent.displayName = `withRenderInBrowser(${
		Component.displayName || Component.name || "Component"
	})`;

	return RenderInBrowserComponent;
}

export default withRenderInBrowser;

// --- UTILS ---

const getSnapshot = (): boolean => true;
