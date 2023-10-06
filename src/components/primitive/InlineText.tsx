import * as React from "react";

import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

type T_InlineTextProps = DR.DOM.HTMLElementAttributes["span"] & {
	is?: "span" | "strong";
};

// --- COMPONENT DEFINITION ---

function InlineText({ is: Tag = "span", children, ...rest }: T_InlineTextProps) {
	return <Tag {...rest}>{children}</Tag>;
}

export default InlineText;
