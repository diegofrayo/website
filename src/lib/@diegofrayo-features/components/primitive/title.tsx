import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const Variant = mirror(["UNSTYLED", "SIMPLE", "STYLED"]);
type Variant = keyof typeof Variant;

const Size = mirror(["SM", "MD", "LG", "XL"]);
type Size = keyof typeof Size;

const As = mirror(["h1", "h2", "h3", "h4", "h5", "h6"]);
type As = keyof typeof As;

export type TitleProps = DR.DOM.HTMLElementAttributes["h1"] & {
	as: As;
	size?: Size;
	variant?: Variant;
};

// --- COMPONENT DEFINITION ---

function Title({
	children,
	className = "",
	as: Tag,
	size,
	variant = Variant.UNSTYLED,
	...rest
}: TitleProps) {
	// --- STYLES ---
	const classes = {
		element: cn(
			`dr-title dr-title--${variant.toLowerCase()}`,
			styles({ as: Tag, size, variant }),
			className,
		),
	};

	return (
		<Tag
			className={classes.element}
			{...rest}
		>
			{children}
		</Tag>
	);
}

Title.variant = Variant;
Title.size = Size;

export default Title;

// --- STYLES ---

const styles = cva("font-bold", {
	variants: {
		as: {
			h1: "",
			h2: "",
			h3: "",
			h4: "",
			h5: "",
			h6: "",
		},
		size: {
			[Size.XL]: "text-4xl",
			[Size.LG]: "text-3xl",
			[Size.MD]: "text-2xl",
			[Size.SM]: "text-xl",
		},
		variant: {
			[Variant.UNSTYLED]: "",
			[Variant.SIMPLE]: "font-titles",
			[Variant.STYLED]: "font-titles inline-block border-b-4 border-black pr-6 text-black",
		},
	},
	compoundVariants: [
		{
			as: As.h1,
			className: "text-4xl",
			variant: Variant.STYLED,
		},
		{
			as: As.h2,
			className: "text-3xl",
			variant: Variant.STYLED,
		},
		{
			as: As.h3,
			className: "text-2xl",
			variant: Variant.STYLED,
		},
		{
			as: As.h4,
			className: "text-xl",
			variant: Variant.STYLED,
		},
		{
			as: As.h5,
			className: "text-lg",
			variant: Variant.STYLED,
		},
		{
			as: As.h6,
			className: "text-base",
			variant: Variant.STYLED,
		},
	],
});
