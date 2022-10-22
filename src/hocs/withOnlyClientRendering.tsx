import { isBrowser } from "~/utils/app";
import type { T_ReactFunctionComponent } from "~/types";

import renderIf from "./renderIf";

function withOnlyClientRendering<G_ComponentProps>(
	Component: T_ReactFunctionComponent<G_ComponentProps>,
): T_ReactFunctionComponent<G_ComponentProps> {
	return renderIf(Component)(() => isBrowser());
}

export default withOnlyClientRendering;
