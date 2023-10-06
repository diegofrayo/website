import * as React from "react";
import cn from "classnames";

import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

type T_TextProps = DR.DOM.HTMLElementAttributes["p"];

// --- COMPONENT DEFINITION ---

function Text({ children, className = "", ...rest }: T_TextProps) {
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

// --- INTERNALS ---

function removeTextElements(children: DR.React.Children): DR.React.Children {
	if (React.isValidElement(children) && children.type === "p") {
		return children.props.children;
	}

	return children;
}
