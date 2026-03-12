import type DR from "../types";
import { isBrowser } from "../validator";
import withConditionalRender from "./with-conditional-render";

function withRenderInBrowser<ComponentProps extends object>(
	Component: DR.React.FunctionComponent<ComponentProps>,
): DR.React.FunctionComponent<ComponentProps> {
	return withConditionalRender(Component)(() => isBrowser());
}

export default withRenderInBrowser;
