import { forwardRef } from "react";
import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const Variant = mirror(["UNSTYLED", "SMOOTH", "STYLED"]);
type Variant = keyof typeof Variant;
const Size = mirror(["SM", "BASE"]);
type Size = keyof typeof Size;
type ButtonProps = DR.DOM.HTMLElementAttributes["button"] & {
	size?: Size;
	type?: "submit" | "button" | "reset";
	variant?: Variant;
};

// --- COMPONENT DEFINITION ---

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		children,
		className = "",
		disabled = false,
		onClick,
		size = Size.BASE,
		type = "button",
		variant = Variant.UNSTYLED,
		...rest
	}: ButtonProps,
	forwardedRef,
) {
	const classes = {
		element: cn(
			`dr-button dr-button--${variant.toLowerCase()}`,
			stylesVariants({ variant, disabled, size }),
			className,
		),
	};

	return (
		<button
			type={type}
			className={classes.element}
			disabled={disabled}
			onClick={onClick}
			ref={forwardedRef}
			{...rest}
		>
			{children}
		</button>
	);
}) as DR.React.CompoundedComponent<
	ButtonProps,
	HTMLButtonElement,
	{ size: typeof Size; variant: typeof Variant }
>;

Button.size = Size;
Button.variant = Variant;

export default Button;

// --- STYLES ---

const stylesVariants = cva("", {
	variants: {
		disabled: {
			true: "pointer-events-none opacity-50",
		},
		size: {
			[Size.SM]: "",
			[Size.BASE]: "",
		},
		variant: {
			[Variant.UNSTYLED]: "",
			[Variant.SMOOTH]: "with-transition-opacity",
			[Variant.STYLED]: cn([
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
			variant: Variant.STYLED,
			size: Size.SM,
			class:
				"h-8 border-x-2 border-b-4 text-sm duration-150 active:translate-y-0.5 active:border-b-2",
		},
		{
			variant: Variant.STYLED,
			size: Size.BASE,
			class:
				"h-10 border-x-4 border-b-8 text-base duration-300 active:translate-y-1 active:border-b-4",
		},
	],
});
