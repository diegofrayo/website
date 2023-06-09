import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "DEFAULT"]);
type T_Variant = keyof typeof VARIANTS;
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
	// --- UTILS ---
	function composeClassName(): string {
		return classNames(
			variant === VARIANTS.SIMPLE && "dfr-transition-opacity",
			variant === VARIANTS.DEFAULT &&
				"dfr-transition-opacity dfr-text-color-gs-black tw-text-sm tw-lowercase dark:dfr-text-color-gs-white tw-font-bold",
			disabled && "tw-cursor-not-allowed tw-opacity-50",
			className,
		);
	}

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
