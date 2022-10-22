import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS = mirror(["UNSTYLED", "FEATURED", "QUOTE"]);
type T_Variant = keyof typeof VARIANTS;
type T_BlockProps = T_HTMLElementAttributes["div"] & {
	is?:
		| "main"
		| "div"
		| "section"
		| "article"
		| "header"
		| "aside"
		| "footer"
		| "blockquote"
		| "span";
	variant?: T_Variant;
};

const Block = React.forwardRef<HTMLDivElement, T_BlockProps>(function Block(
	{ is: Tag = "div", children, variant = VARIANTS.UNSTYLED, className = "", ...rest },
	ref,
): T_ReactElement {
	// utils
	function composeClassName(): string {
		return classNames(
			className,
			variant === VARIANTS.FEATURED &&
				"dfr-bg-color-secondary dfr-border-color-primary tw-border tw-border-l-4 tw-p-4",
			variant === VARIANTS.QUOTE &&
				"dfr-border-color-primary dfr-text-color-secondary tw-px-4 tw-border-l-4 tw-italic",
		);
	}

	return (
		<Tag
			className={composeClassName()}
			ref={ref}
			{...rest}
		>
			{children}
		</Tag>
	);
});

// TODO: Typing issue
// @ts-ignore
Block.variant = VARIANTS;

export default Block;
