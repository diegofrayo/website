import { mergeProps } from "@base-ui/react";
import { useRender } from "@base-ui/react/use-render";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { ButtonSize, buttonStyles, ButtonVariant } from "./button.styles";

// --- PROPS & TYPES ---

type ButtonProps = useRender.ComponentProps<"button"> & {
	size?: ButtonSize;
	type?: "submit" | "button" | "reset";
	variant?: ButtonVariant;
};

// --- COMPONENT DEFINITION ---

const Button = function Button({
	children,
	className = "",
	disabled = false,
	size = ButtonSize.BASE,
	type = "button",
	variant = ButtonVariant.UNSTYLED,
	render,
	onClick,
	...otherProps
}: ButtonProps): ReactTypes.JSXElement {
	const classes = {
		element: cn(
			`dr-button dr-button--${variant.toLowerCase()}`,
			buttonStyles({ variant, disabled, size }),
			className,
		),
	};

	const defaultProps: useRender.ElementProps<"button"> = {
		className: classes.element,
		children,
		disabled,
		type,
		onClick,
	};

	const element = useRender({
		defaultTagName: "button",
		props: mergeProps<"button">(defaultProps, otherProps),
		render,
	});

	return element;
};

export default Button;
