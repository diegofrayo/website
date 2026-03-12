import { Children, cloneElement, isValidElement } from "react";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import styles from "./list.styles.module.css";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE"]);
type Variant = keyof typeof VARIANTS;
type ListProps = DR.DOM.HTMLElementAttributes["ul"] & {
	variant?: Variant;
};

// --- COMPONENT DEFINITION ---

function List({ children, variant = VARIANTS.UNSTYLED, className = "" }: ListProps) {
	// --- COMPUTED STATES ---
	const isDefaultVariant = variant === VARIANTS.SIMPLE;

	return (
		<ul
			className={cn(
				`dr-list dr-list--${variant.toLowerCase()}`,
				"block w-full",
				isDefaultVariant && styles["dr-list--default"],
				className,
			)}
		>
			{Children.map(children, (child) => {
				if (isValidElement<ListItemChildProps>(child)) {
					return cloneElement(child, { ...child.props, isDefaultVariant });
				}

				return child;
			})}
		</ul>
	);
}

List.variant = VARIANTS;

export default List;

// --- COMPONENTS ---

List.Item = function ListItem({
	children,
	isDefaultVariant = false,
	className = "",
	...rest
}: DR.DOM.HTMLElementAttributes["li"] & { isDefaultVariant?: boolean }) {
	return (
		<li
			className={cn(
				`dr-list-item dr-list-item--${isDefaultVariant ? "default" : "unstyled"}`,
				isDefaultVariant && styles["dr-list-item--default"],
				className,
			)}
			{...rest}
		>
			{children}
		</li>
	);
};

// --- TYPES ---

type ListItemChildProps = DR.DOM.HTMLElementAttributes["li"] & {
	isDefaultVariant: boolean;
};
