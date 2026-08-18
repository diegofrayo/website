import { Children, cloneElement, isValidElement } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE"]);
type Variant = keyof typeof VARIANTS;
type ListProps = ReactTypes.DOM.HTMLElementAttributes["ul"] & {
	variant?: Variant;
};

// --- COMPONENT DEFINITION ---

function List({ children, variant = VARIANTS.UNSTYLED, className }: ListProps) {
	// --- COMPUTED STATES ---
	const isSimpleVariant = variant === VARIANTS.SIMPLE;

	return (
		<ul
			className={cn(
				`dr-list dr-list--${variant.toLowerCase()}`,
				"block w-full",
				{ "list-outside list-[square] pl-4": isSimpleVariant },
				className,
			)}
		>
			{Children.map(children, (child) => {
				if (isValidElement<ListItemChildProps>(child)) {
					return cloneElement(child, { ...child.props, isSimpleVariant });
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
	isSimpleVariant,
	className,
	...rest
}: ReactTypes.DOM.HTMLElementAttributes["li"] & { isSimpleVariant?: boolean }) {
	return (
		<li
			className={cn(
				`dr-list-item dr-list-item--${isSimpleVariant ? "default" : "unstyled"}`,
				{ "mb-1 last:mb-0": isSimpleVariant },
				className,
			)}
			{...rest}
		>
			{children}
		</li>
	);
};

// --- TYPES ---

type ListItemChildProps = ReactTypes.DOM.HTMLElementAttributes["li"] & {
	isSimpleVariant: boolean;
};
