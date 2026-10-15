import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS ---

const ButtonVariants = keyMirror(["UNSTYLED", "SMOOTH", "STYLED"]);
type ButtonVariant = keyof typeof ButtonVariants;

const ButtonSizes = keyMirror(["SM", "BASE"]);
type ButtonSize = keyof typeof ButtonSizes;

export { ButtonVariants, type ButtonVariant, ButtonSizes, type ButtonSize };

// --- STYLES ---

export const buttonStyles = cva("", {
	variants: {
		disabled: {
			true: "pointer-events-none opacity-50",
		},
		size: {
			[ButtonSizes.SM]: "",
			[ButtonSizes.BASE]: "",
		},
		variant: {
			[ButtonVariants.UNSTYLED]: "",
			[ButtonVariants.SMOOTH]: "u-transition-opacity",
			[ButtonVariants.STYLED]: cn([
				"transition-all",
				"bg-white",
				"rounded-sm px-2",
				"border border-zinc-700 shadow-md shadow-zinc-400",
				"text-base font-bold text-black uppercase",
				"hover:opacity-75",
			]),
		},
	},
	compoundVariants: [
		{
			variant: ButtonVariants.STYLED,
			size: ButtonSizes.SM,
			class: "h-8 border-x-2 border-b-4 text-sm duration-150 active:translate-y-0.5 active:border-b-2",
		},
		{
			variant: ButtonVariants.STYLED,
			size: ButtonSizes.BASE,
			class: "h-10 border-x-4 border-b-8 text-base duration-300 active:translate-y-1 active:border-b-4",
		},
	],
});
