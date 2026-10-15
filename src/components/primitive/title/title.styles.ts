import { cva } from "class-variance-authority";

import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS ---

const TitleVariants = keyMirror(["UNSTYLED", "SIMPLE", "STYLED"]);
type TitleVariant = keyof typeof TitleVariants;

const TitleSizes = keyMirror(["SM", "MD", "LG", "XL"]);
type TitleSize = keyof typeof TitleSizes;

const TitleAs = keyMirror(["h1", "h2", "h3", "h4", "h5", "h6"]);
type TitleAs = keyof typeof TitleAs;

export { TitleVariants, type TitleVariant, TitleSizes, type TitleSize, TitleAs };

// --- STYLES ---

export const titleStyles = cva("font-bold", {
	variants: {
		as: {
			[TitleAs.h1]: "",
			[TitleAs.h2]: "",
			[TitleAs.h3]: "",
			[TitleAs.h4]: "",
			[TitleAs.h5]: "",
			[TitleAs.h6]: "",
		},
		size: {
			[TitleSizes.XL]: "text-4xl",
			[TitleSizes.LG]: "text-3xl",
			[TitleSizes.MD]: "text-2xl",
			[TitleSizes.SM]: "text-xl",
		},
		variant: {
			[TitleVariants.UNSTYLED]: "",
			[TitleVariants.SIMPLE]: "font-titles",
			[TitleVariants.STYLED]: "font-titles inline-block border-b-4 border-black pr-2 text-black",
		},
	},
	compoundVariants: [
		{
			as: TitleAs.h1,
			className: "text-4xl",
			variant: TitleVariants.STYLED,
		},
		{
			as: TitleAs.h2,
			className: "text-3xl",
			variant: TitleVariants.STYLED,
		},
		{
			as: TitleAs.h3,
			className: "text-2xl",
			variant: TitleVariants.STYLED,
		},
		{
			as: TitleAs.h4,
			className: "text-xl",
			variant: TitleVariants.STYLED,
		},
		{
			as: TitleAs.h5,
			className: "text-lg",
			variant: TitleVariants.STYLED,
		},
		{
			as: TitleAs.h6,
			className: "text-base",
			variant: TitleVariants.STYLED,
		},
	],
});
