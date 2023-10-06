import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import type DR from "@diegofrayo/types";

type T_RenderIfReturn<G_ComponentProps> = (
	callback: () => boolean,
) => DR.React.FunctionComponent<G_ComponentProps>;

function renderIf<G_ComponentProps extends object>(
	WrappedComponent: DR.React.FunctionComponent<G_ComponentProps>,
): T_RenderIfReturn<G_ComponentProps> {
	const renderIfReturn: T_RenderIfReturn<G_ComponentProps> = function renderIfReturn(callback) {
		function RenderIfComponent(props: G_ComponentProps): DR.React.JSXElementNullable {
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
