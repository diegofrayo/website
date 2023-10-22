import * as React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";

import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE"]);
type T_Variant = keyof typeof VARIANTS;
type T_ButtonProps = DR.DOM.HTMLElementAttributes["button"] & {
	variant?: T_Variant;
	type?: "submit" | "button" | "reset";
};

// --- COMPONENT DEFINITION ---

const Button = React.forwardRef<HTMLButtonElement, T_ButtonProps>(function Button(
	{
		children,
		variant = VARIANTS.UNSTYLED,
		className = "",
		disabled = false,
		type = "button",
		onClick,
		...rest
	}: T_ButtonProps,
	forwardedRef,
) {
	return (
		<button
			type={type} // eslint-disable-line react/button-has-type
			className={cn(
				`dr-button dr-button--${variant.toLowerCase()}`,
				styles({ variant, disabled }),
				className,
			)}
			disabled={disabled}
			onClick={onClick}
			ref={forwardedRef}
			{...rest}
		>
			{children}
		</button>
	);
}) as DR.React.CompoundedComponent<T_ButtonProps, HTMLButtonElement, { variant: typeof VARIANTS }>;

Button.variant = VARIANTS;

export default Button;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[VARIANTS.UNSTYLED]: "",
			[VARIANTS.SIMPLE]: "dr-transition-opacity",
		},
		disabled: {
			true: "tw-cursor-not-allowed tw-opacity-50",
		},
	},
});
