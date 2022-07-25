import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactChildren, T_ReactElement } from "~/types";

type T_TextProps = T_HTMLElementAttributes["p"] & { is?: "p" | "pre" };

function Text({ children, className = "", is = "p", ...rest }: T_TextProps): T_ReactElement {
	/*
	 * TODO: Typing issue
	 * A possible solution: https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript
	 */
	// @ts-ignore
	const Element = is as T_ReactFunctionComponent;

	if (is === "p") {
		return (
			<Element
				className={classNames("dfr-Text--plain", className)}
				{...rest}
			>
				{parseChildren(children)}
			</Element>
		);
	}

	return (
		<Element
			className={classNames("dfr-Text--preformatted tw-max-w-full", className)}
			{...rest}
		>
			{children}
		</Element>
	);
}

export default Text;

// --- Utils ---

function parseChildren(children: T_ReactChildren): T_ReactChildren {
	if (React.isValidElement(children) && children.type === "p") {
		return children.props.children;
	}

	return children;
}
