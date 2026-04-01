import { isValidElement } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

// --- PROPS & TYPES ---

type TextProps = ReactTypes.DOM.HTMLElementAttributes["p"];

// --- COMPONENT DEFINITION ---

function Text({ children, className = "", ...rest }: TextProps) {
	return (
		<p
			className={cn("dr-text", className)}
			{...rest}
		>
			{removeTextElements(children)}
		</p>
	);
}

export default Text;

// --- UTILS ---

function removeTextElements(children: ReactTypes.Children): ReactTypes.Children {
	if (isValidElement<ChildElementProps>(children) && children.type === "p") {
		return children.props.children;
	}

	return children;
}

// --- TYPES ---

type ChildElementProps = {
	children: ReactTypes.Children;
};
