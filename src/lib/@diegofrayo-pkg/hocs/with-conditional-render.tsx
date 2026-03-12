import hoistNonReactStatics from "hoist-non-react-statics";

import type DR from "../types";

type WithConditionalRenderReturn<ComponentProps> = (
	callback: () => boolean,
) => DR.React.FunctionComponent<ComponentProps>;

function withConditionalRender<ComponentProps extends object>(
	WrappedComponent: DR.React.FunctionComponent<ComponentProps>,
): WithConditionalRenderReturn<ComponentProps> {
	const withConditionalRenderReturn: WithConditionalRenderReturn<ComponentProps> =
		function withConditionalRenderReturn(callback) {
			function RenderIfComponent(props: ComponentProps): DR.React.JSXElementNullable {
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
