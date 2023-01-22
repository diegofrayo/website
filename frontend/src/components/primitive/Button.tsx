import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/@diegofrayo/library/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/@diegofrayo/library/types/react";

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "DEFAULT"]);
type T_Variant = keyof typeof VARIANTS;
type T_ButtonProps = T_HTMLElementAttributes["button"] & {
	variant?: T_Variant;
};

function Button({
	children,
	variant = VARIANTS.UNSTYLED,
	className = "",
	disabled = false,
	onClick,
	...rest
}: T_ButtonProps): T_ReactElement {
	return (
		<button
			className={composeClassName(variant, disabled, className)}
			disabled={disabled}
			onClick={onClick}
			{...rest}
		>
			{children}
		</button>
	);
}

Button.variant = VARIANTS;

export default Button;

// --- Utils ---

function composeClassName(
	variant: T_ButtonProps["variant"],
	disabled: T_ButtonProps["disabled"],
	className: T_ButtonProps["className"],
): string {
	return classNames(
		variant === VARIANTS.SIMPLE && "dfr-transition-opacity",
		variant === VARIANTS.DEFAULT &&
			"dfr-transition-opacity tw-text-black tw-text-sm tw-lowercase dark:tw-text-white tw-font-bold",
		disabled && "tw-cursor-not-allowed tw-opacity-50",
		className,
	);
}
