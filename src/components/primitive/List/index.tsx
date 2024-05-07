import * as React from "react";

import cn from "~/lib/cn";
import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

import styles from "./styles.module.css";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE"]);
type T_Variant = keyof typeof VARIANTS;
type T_ListProps = DR.DOM.HTMLElementAttributes["ul"] & {
	variant?: T_Variant;
};

// --- COMPONENT DEFINITION ---

function List({ children, variant = VARIANTS.UNSTYLED, className = "" }: T_ListProps) {
	// --- VARS ---
	const isDefaultVariant = variant === VARIANTS.SIMPLE;

	return (
		<ul
			className={cn(
				`dr-list dr-list--${variant.toLowerCase()}`,
				"tw-block tw-w-full",
				isDefaultVariant && styles["dr-list--default"],
				className,
			)}
		>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {
						...child.props,
						isDefaultVariant,
					});
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
