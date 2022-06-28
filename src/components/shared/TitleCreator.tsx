import * as React from "react";

import TitlePrimitive, { T_TitleProps } from "~/components/primitive/Title";
import type { T_ReactChildren, T_ReactElement, T_ReactFunctionComponent } from "~/types";

function TitleCreator(
	Tag: "h1" | "h2" | "h3" | "h4",
	props: Omit<T_TitleProps, "children" | "is">,
): T_ReactFunctionComponent<{ children: T_ReactChildren }> {
	return function TitleComponent({ children }: { children: T_ReactChildren }): T_ReactElement {
		return (
			<TitlePrimitive
				{...props}
				is={Tag}
			>
				{children}
			</TitlePrimitive>
		);
	};
}

export default TitleCreator;
