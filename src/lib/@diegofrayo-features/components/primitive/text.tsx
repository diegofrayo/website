import { isValidElement } from "react";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";

// --- PROPS & TYPES ---

type TextProps = DR.DOM.HTMLElementAttributes["p"];

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

function removeTextElements(children: DR.React.Children): DR.React.Children {
	if (isValidElement<ChildElementProps>(children) && children.type === "p") {
		return children.props.children;
	}

	return children;
}

// --- TYPES ---

type ChildElementProps = {
	children: DR.React.Children;
};
