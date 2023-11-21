import { isBrowser } from "@diegofrayo/utils/misc";
import type DR from "@diegofrayo/types";

import renderIf from "./renderIf";

export function withOnlyClientRender<G_ComponentProps extends object>(
	Component: DR.React.FunctionComponent<G_ComponentProps>,
): DR.React.FunctionComponent<G_ComponentProps> {
	return renderIf(Component)(() => isBrowser());
}

export const ClientRenderComponent = withOnlyClientRender(function ClientRenderComponent({
	children,
}: {
	children: DR.React.Children;
}) {
	return children;
});
