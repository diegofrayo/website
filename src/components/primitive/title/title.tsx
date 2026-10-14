import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { titleStyles, TitleVariant, type TitleAs, type TitleSize } from "./title.styles";

// --- PROPS & TYPES ---

export type TitleProps = ReactTypes.DOM.HTMLElementAttributes["h1"] & {
	as: TitleAs;
	size?: TitleSize;
	variant?: TitleVariant;
};

// --- COMPONENT DEFINITION ---

function Title({
	children,
	className = "",
	as: Tag,
	size,
	variant = TitleVariant.UNSTYLED,
	...rest
}: TitleProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		element: cn(
			`dr-title dr-title--${variant.toLowerCase()}`,
			titleStyles({ as: Tag, size, variant }),
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

export default Title;
