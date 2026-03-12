import type DR from "@diegofrayo-pkg/types";

// --- PROPS & TYPES ---

type InlineTextProps = DR.DOM.HTMLElementAttributes["span"] & {
	as?: "span" | "strong";
};

// --- COMPONENT DEFINITION ---

function InlineText({ as: Tag = "span", children, ...rest }: InlineTextProps) {
	return <Tag {...rest}>{children}</Tag>;
}

export default InlineText;
