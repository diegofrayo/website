import { Children, cloneElement, isValidElement } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const ListVariants = keyMirror(["UNSTYLED", "SIMPLE"]);
type ListVariant = keyof typeof ListVariants;

type ListProps = ReactTypes.DOM.HTMLElementAttributes["ul"] & {
	variant?: ListVariant;
};

// --- COMPONENT DEFINITION ---

function List({
	children,
	className,
	variant = ListVariants.UNSTYLED,
	...rest
}: ListProps): ReactTypes.JSXElement {
	// --- COMPUTED STATES ---
	const isSimpleVariant = variant === ListVariants.SIMPLE;

	// --- STYLES ---
	const classes = {
		root: cn(
			`dr-list dr-list--${variant.toLowerCase()}`,
			"block w-full",
			{ "list-outside list-[square] pl-4": isSimpleVariant },
			className,
		),
	};

	// --- UTILS ---
	function injectVariantProps(child: ReactTypes.Children): ReactTypes.Children {
		if (isValidElement<ListItemProps>(child)) {
			return cloneElement(child, { ...child.props, isSimpleVariant });
		}

		return child;
	}

	return (
		<ul
			className={classes.root}
			{...rest}
		>
			{Children.map(children, injectVariantProps)}
		</ul>
	);
}

export { ListVariants, type ListVariant };

export default List;

// --- COMPONENTS ---

type ListItemProps = ReactTypes.DOM.HTMLElementAttributes["li"] & {
	isSimpleVariant?: boolean;
};

List.Item = function ListItem({
	children,
	className,
	isSimpleVariant = false,
	...rest
}: ListItemProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		root: cn(
			`dr-list-item dr-list-item--${isSimpleVariant ? "default" : "unstyled"}`,
			{ "mb-1 last:mb-0": isSimpleVariant },
			className,
		),
	};

	return (
		<li
			className={classes.root}
			{...rest}
		>
			{children}
		</li>
	);
};
