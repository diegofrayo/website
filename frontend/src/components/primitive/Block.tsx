import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/@diegofrayo/library/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/@diegofrayo/library/types/react";

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

const Block = function Block({
	is: Tag = "div",
	variant = VARIANTS.UNSTYLED,
	className = "",
	children,
	...rest
}: T_BlockProps): T_ReactElement {
	return (
		// TODO: [typescript] Typing issue related to "is" prop
		// @ts-ignore
		<Tag
			className={composeClassName(className, variant)}
			{...rest}
		>
			{children}
		</Tag>
	);
};

Block.variant = VARIANTS;

export default Block;

// --- Utils ---

function composeClassName(
	className: T_BlockProps["className"],
	variant: T_BlockProps["variant"],
): string {
	return classNames(
		className,
		variant === VARIANTS.FEATURED &&
			"dfr-bg-color-secondary dfr-border-color-primary tw-border tw-border-l-4 tw-p-4",
		variant === VARIANTS.QUOTE &&
			"dfr-border-color-primary dfr-text-color-secondary tw-px-4 tw-border-l-4 tw-italic",
	);
}
