import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS_OPTIONS = ["INLINE", "MULTILINE"] as const;
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);
type T_Variant = typeof VARIANTS_OPTIONS[number];
type T_CodeProps = T_HTMLElementAttributes["pre"] & {
	variant: T_Variant;
};

function Code({ children, className, variant, ...rest }: T_CodeProps): T_ReactElement {
	if (variant === VARIANTS.INLINE) {
		return (
			<code className="dfr-Code--inline tw-text-base tw-italic dfr-text-color-inline-code">
				{children}

				<style jsx>
					{`
						code::before,
						code::after {
							content: "\`";
						}
					`}
				</style>
			</code>
		);
	}

	return (
		<div
			className={classNames(
				"dfr-Code--multiline root tw-rounded-md tw-border tw-p-4 tw-font-mono tw-text-base dfr-bg-color-secondary dfr-border-color-primary dark:dfr-bg-color-tertiary",
				className,
			)}
		>
			<pre {...rest}>
				{children}

				<style jsx>
					{`
						pre {
							word-break: keep-all;
							overflow-x: auto;
						}

						pre :global(.dfr-Code--inline::before),
						pre :global(.dfr-Code--inline::after) {
							content: "";
						}

						pre :global(.dfr-Code--inline) {
							@apply dfr-text-color-gs-700;
							font-style: normal;
						}

						:global(.tw-dark) :global(.dfr-Code--multiline) pre :global(.dfr-Code--inline) {
							@apply dfr-text-color-primary;
						}
					`}
				</style>
			</pre>
		</div>
	);
}

Code.variant = VARIANTS;

export default Code;
