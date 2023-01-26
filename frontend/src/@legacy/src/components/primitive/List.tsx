import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/@legacy/src/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/@legacy/src/types";

const VARIANTS = mirror(["UNSTYLED", "DEFAULT"]);
type T_Variant = keyof typeof VARIANTS;

type T_ListProps = T_HTMLElementAttributes["ul"] & {
	variant?: T_Variant;
};

function List({
	children,
	className = "",
	variant = VARIANTS.UNSTYLED,
}: T_ListProps): T_ReactElement {
	const isDefaultVariant = variant === VARIANTS.DEFAULT;

	return (
		<ul
			className={classNames(
				`dfr-List dfr-List--${variant.toLowerCase()}`,
				"tw-list-inside tw-list-none",
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

			<style jsx>
				{`
					.dfr-List--default {
						padding-left: 19px;
					}
				`}
			</style>
		</ul>
	);
}

List.variant = VARIANTS;

export default List;

// --- Components ---

List.Item = function ListItem({
	children,
	isDefaultVariant = false,
	className,
	...rest
}: T_HTMLElementAttributes["li"] & { isDefaultVariant?: boolean }): T_ReactElement {
	return (
		<li
			className={classNames(
				className,
				isDefaultVariant &&
					"dfr-List-Item--default tw-relative tw-mb-3 before:dfr-text-color-bw last:tw-mb-0",
			)}
			{...rest}
		>
			{children}

			<style jsx>{`
				.dfr-List-Item--default::before {
					content: "❯";
					font-size: 14px;
					font-weight: bold;
					left: -19px;
					position: absolute;
					top: 2px;
				}
			`}</style>
		</li>
	);
};
