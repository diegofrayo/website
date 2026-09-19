import type ReactTypes from "@diegofrayo-pkg/types/react";

// --- PROPS & TYPES ---

type InlineTextProps = ReactTypes.DOM.HTMLElementAttributes["span"] & {
	as?: "span" | "strong";
};

// --- COMPONENT DEFINITION ---

function InlineText({
	as: Tag = "span",
	children,
	...rest
}: InlineTextProps): ReactTypes.JSXElement {
	return <Tag {...rest}>{children}</Tag>;
}

export default InlineText;
