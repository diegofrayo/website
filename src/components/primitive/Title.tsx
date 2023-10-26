import * as React from "react";
import { cva } from "class-variance-authority";
import cn from "classnames";

import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "STYLED"]);
type T_Variant = keyof typeof VARIANTS;

const SIZES = mirror(["MD", "LG", "XL"]);
type T_Size = keyof typeof SIZES;

const ELEMENTS = mirror(["h1", "h2", "h3", "h4", "h5", "h6"]);
type T_Elements = keyof typeof ELEMENTS;

export type T_TitleProps = {
	is: T_Elements;
	variant?: T_Variant;
	size?: T_Size;
} & DR.DOM.HTMLElementAttributes["h1"];

// --- COMPONENT DEFINITION ---

function Title({
	children,
	is: Tag,
	variant = VARIANTS.UNSTYLED,
	size,
	className = "",
	...rest
}: T_TitleProps) {
	return (
		<Tag
			className={cn(
				`dr-title dr-title--${variant.toLowerCase()}`,
				"tw-font-bold",
				styles({ variant, size, is: Tag }),
				className,
			)}
			{...rest}
		>
			{children}
		</Tag>
	);
}

Title.variant = VARIANTS;
Title.size = SIZES;

export default Title;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[VARIANTS.UNSTYLED]: "",
			[VARIANTS.SIMPLE]: "dr-font-titles",
			[VARIANTS.STYLED]: "tw-text-white dr-font-titles",
		},
		size: {
			[SIZES.MD]: "tw-text-2xl",
			[SIZES.LG]: "tw-text-3xl",
			[SIZES.XL]: "tw-text-4xl",
		},
		is: {
			h1: "",
			h2: "",
			h3: "",
			h4: "",
			h5: "",
			h6: "",
		},
	},
	compoundVariants: [
		{
			variant: VARIANTS.STYLED,
			is: ELEMENTS.h1,
			className: "tw-text-4xl",
		},
		{
			variant: VARIANTS.STYLED,
			is: ELEMENTS.h2,
			className: "tw-text-3xl",
		},
		{
			variant: VARIANTS.STYLED,
			is: ELEMENTS.h3,
			className: "tw-text-2xl",
		},
		{
			variant: VARIANTS.STYLED,
			is: ELEMENTS.h4,
			className: "tw-text-xl",
		},
		{
			variant: VARIANTS.STYLED,
			is: ELEMENTS.h5,
			className: "tw-text-lg",
		},
		{
			variant: VARIANTS.STYLED,
			is: ELEMENTS.h6,
			className: "tw-text-base",
		},
	],
});
