import { isBrowser } from "~/utils/app";
import type DR from "@diegofrayo/types";

import renderIf from "./renderIf";

function withOnlyClientRendering<G_ComponentProps extends object>(
	Component: DR.React.FunctionComponent<G_ComponentProps>,
): DR.React.FunctionComponent<G_ComponentProps> {
	return renderIf(Component)(() => isBrowser());
}

export default withOnlyClientRendering;
