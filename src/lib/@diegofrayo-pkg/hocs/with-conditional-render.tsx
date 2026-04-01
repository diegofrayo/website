import hoistNonReactStatics from "hoist-non-react-statics";

import type ReactTypes from "../types/react";

type WithConditionalRenderReturn<ComponentProps> = (
	callback: () => boolean,
) => ReactTypes.FunctionComponent<ComponentProps>;

function withConditionalRender<ComponentProps extends object>(
	WrappedComponent: ReactTypes.FunctionComponent<ComponentProps>,
): WithConditionalRenderReturn<ComponentProps> {
	const withConditionalRenderReturn: WithConditionalRenderReturn<ComponentProps> =
		function withConditionalRenderReturn(callback) {
			function RenderIfComponent(props: ComponentProps): ReactTypes.JSXElementNullable {
				const shouldRender = callback();

				if (!shouldRender) return null;

				return <WrappedComponent {...props} />;
			}

			RenderIfComponent.displayName = `withConditionalRender(${
				WrappedComponent.displayName || WrappedComponent.name || "Component"
			})`;

			return hoistNonReactStatics(RenderIfComponent, WrappedComponent);
		};

	return withConditionalRenderReturn;
}

export default withConditionalRender;
