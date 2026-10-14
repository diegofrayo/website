import { cva } from "class-variance-authority";

import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS ---

const TitleVariant = keyMirror(["UNSTYLED", "SIMPLE", "STYLED"]);
type TitleVariant = keyof typeof TitleVariant;

const TitleSize = keyMirror(["SM", "MD", "LG", "XL"]);
type TitleSize = keyof typeof TitleSize;

const TitleAs = keyMirror(["h1", "h2", "h3", "h4", "h5", "h6"]);
type TitleAs = keyof typeof TitleAs;

export { TitleVariant, TitleSize, TitleAs };

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
			[TitleSize.XL]: "text-4xl",
			[TitleSize.LG]: "text-3xl",
			[TitleSize.MD]: "text-2xl",
			[TitleSize.SM]: "text-xl",
		},
		variant: {
			[TitleVariant.UNSTYLED]: "",
			[TitleVariant.SIMPLE]: "font-titles",
			[TitleVariant.STYLED]: "font-titles inline-block border-b-4 border-black pr-2 text-black",
		},
	},
	compoundVariants: [
		{
			as: TitleAs.h1,
			className: "text-4xl",
			variant: TitleVariant.STYLED,
		},
		{
			as: TitleAs.h2,
			className: "text-3xl",
			variant: TitleVariant.STYLED,
		},
		{
			as: TitleAs.h3,
			className: "text-2xl",
			variant: TitleVariant.STYLED,
		},
		{
			as: TitleAs.h4,
			className: "text-xl",
			variant: TitleVariant.STYLED,
		},
		{
			as: TitleAs.h5,
			className: "text-lg",
			variant: TitleVariant.STYLED,
		},
		{
			as: TitleAs.h6,
			className: "text-base",
			variant: TitleVariant.STYLED,
		},
	],
});
