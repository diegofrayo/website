import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS_OPTIONS = ["UNSTYLED", "DEFAULT"] as const;
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);
type T_Variant = typeof VARIANTS_OPTIONS[number];

type T_ListProps = T_HTMLElementAttributes["ul"] & {
	is?: "ul" | "menu";
	variant?: T_Variant;
};

function List({
	is: Element = "ul",
	children,
	className = "",
	variant = VARIANTS.UNSTYLED,
}: T_ListProps): T_ReactElement {
	return (
		<Element
			className={classNames(
				`dfr-List dfr-List--${variant.toLowerCase()}`,
				"tw-list-inside tw-list-none",
				className,
			)}
		>
			{children}

			<style jsx>
				{`
					.dfr-List--default {
						padding-left: 19px;
					}

					.dfr-List--default :global(li) {
						@apply tw-mb-3;
						@apply last:tw-mb-0;
						position: relative;
					}

					.dfr-List--default :global(li)::before {
						@apply dfr-text-color-bw;
						content: "❯";
						font-weight: bold;
						font-size: 14px;
						left: -19px;
						position: absolute;
						top: 2px;
					}
				`}
			</style>
		</Element>
	);
}

List.variant = VARIANTS;

export default List;

// --- Components ---

List.Item = function ListItem({
	children,
	...rest
}: T_HTMLElementAttributes["li"]): T_ReactElement {
	return <li {...rest}>{children}</li>;
};
