import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS_OPTIONS = ["UNSTYLED", "SIMPLE", "DEFAULT"] as const;
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);
type T_Variant = typeof VARIANTS_OPTIONS[number];
type T_ButtonProps = T_HTMLElementAttributes["button"] & {
	variant?: T_Variant;
	type?: "submit" | "button" | "reset";
};

function Button({
	children,
	variant = VARIANTS.UNSTYLED,
	className = "",
	disabled = false,
	type = "button",
	onClick,
	...rest
}: T_ButtonProps): T_ReactElement {
	// utils
	function composeClassName(): string {
		return classNames(
			variant === VARIANTS.SIMPLE && "dfr-transition-opacity",
			variant === VARIANTS.DEFAULT &&
				"dfr-transition-opacity dfr-text-color-dark-strong tw-text-sm tw-lowercase dark:dfr-text-color-light-strong tw-font-bold",
			disabled && "tw-cursor-not-allowed tw-opacity-50",
			className,
		);
	}

	// render
	return (
		<button
			type={type === "button" ? "button" : "submit"}
			className={composeClassName()}
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
