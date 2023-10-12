import * as React from "react";

import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

type T_BlockProps = DR.DOM.HTMLElementAttributes["div"] & {
	is?: "main" | "div" | "section" | "article" | "header" | "aside" | "footer" | "span";
};

// --- COMPONENT DEFINITION ---

const Block = React.forwardRef<HTMLDivElement, T_BlockProps>(function Block(
	{ is: Tag = "div", children, className = "", ...rest },
	ref,
) {
	return (
		<Tag
			ref={ref}
			className={className}
			{...rest}
		>
			{children}
		</Tag>
	);
});

export default Block;
