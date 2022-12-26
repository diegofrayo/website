import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import type { T_ReactElementNullable, T_ReactFunctionComponent } from "~/types";

type T_RenderIfReturn<G_ComponentProps> = (
	callback: () => boolean,
) => T_ReactFunctionComponent<G_ComponentProps>;

function renderIf<G_ComponentProps extends object>(
	WrappedComponent: T_ReactFunctionComponent<G_ComponentProps>,
): T_RenderIfReturn<G_ComponentProps> {
	const renderIfReturn: T_RenderIfReturn<G_ComponentProps> = function renderIfReturn(callback) {
		function RenderIfComponent(props: G_ComponentProps): T_ReactElementNullable {
			const [hasToRender, setHasToRender] = React.useState(false);

			useDidMount(() => {
				setHasToRender(callback());
			});

			if (hasToRender) {
				return <WrappedComponent {...props} />;
			}

			return null;
		}

		RenderIfComponent.displayName = `renderIf(${
			WrappedComponent.displayName || WrappedComponent.name || "Component"
		})`;

		return hoistNonReactStatics(RenderIfComponent, WrappedComponent);
	};

	return renderIfReturn;
}

export default renderIf;
