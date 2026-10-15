import { isValidElement } from "react";

import type ReactTypes from "@diegofrayo-pkg/types/react";

// --- PROPS & TYPES ---

type ParagraphProps = ReactTypes.DOM.HTMLElementAttributes["p"];

// --- COMPONENT DEFINITION ---

function Paragraph({ children, ...rest }: ParagraphProps): ReactTypes.JSXElement {
	return <p {...rest}>{removeParagraphElements(children)}</p>;
}

export default Paragraph;

// --- UTILS ---

function removeParagraphElements(children: ReactTypes.Children): ReactTypes.Children {
	if (isValidElement<ChildElementProps>(children) && children.type === "p") {
		return children.props.children;
	}

	return children;
}

// --- TYPES ---

type ChildElementProps = {
	children: ReactTypes.Children;
};
