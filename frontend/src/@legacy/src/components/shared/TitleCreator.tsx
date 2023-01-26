import * as React from "react";

import TitlePrimitive, { T_TitleProps } from "~/@legacy/src/components/primitive/Title";
import type { T_ReactChildren, T_ReactElement, T_ReactFunctionComponent } from "~/@legacy/src/types";

/*
 * WARN:
 * Useful to make this component compatible with ReactMarkdown library
 */
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T_Return = T_ReactFunctionComponent<any>;

function TitleCreator(
	Tag: "h1" | "h2" | "h3" | "h4",
	props: Omit<T_TitleProps, "children" | "is">,
): T_Return {
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
