import { isBrowser } from "~/@legacy/src/utils/app";
import type { T_ReactFunctionComponent } from "~/@legacy/src/types";

import renderIf from "./renderIf";

function withOnlyClientRendering<G_ComponentProps extends object>(
	Component: T_ReactFunctionComponent<G_ComponentProps>,
): T_ReactFunctionComponent<G_ComponentProps> {
	return renderIf(Component)(() => isBrowser());
}

export default withOnlyClientRendering;
