import { forwardRef } from "react";

import type ReactTypes from "@diegofrayo-pkg/types/react";

// --- PROPS & TYPES ---

type BoxProps = ReactTypes.DOM.HTMLElementAttributes["div"] & {
	as?: "main" | "div" | "section" | "article" | "header" | "aside" | "footer" | "span";
};

// --- COMPONENT DEFINITION ---

const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
	{ as: Tag = "div", children, ...rest },
	ref,
) {
	return (
		<Tag
			ref={ref}
			{...rest}
		>
			{children}
		</Tag>
	);
});

export default Box;
