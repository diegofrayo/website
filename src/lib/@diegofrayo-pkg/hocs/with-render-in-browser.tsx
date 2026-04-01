import type ReactTypes from "../types/react";
import { isBrowser } from "../validator";
import withConditionalRender from "./with-conditional-render";

function withRenderInBrowser<ComponentProps extends object>(
	Component: ReactTypes.FunctionComponent<ComponentProps>,
): ReactTypes.FunctionComponent<ComponentProps> {
	return withConditionalRender(Component)(() => isBrowser());
}

export default withRenderInBrowser;
