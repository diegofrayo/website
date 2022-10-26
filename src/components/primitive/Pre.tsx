import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS = mirror([
	"UNSTYLED",
	"STYLED",
	"BREAK_WORDS",
	"BREAK_WITH_BLANK_LINES",
	"BREAK_WITH_BLANK_SPACES",
]);
type T_Variant = keyof typeof VARIANTS;
type T_PreProps = T_HTMLElementAttributes["pre"] & {
	variant: T_Variant;
};

function Pre({ children, className, variant, ...rest }: T_PreProps): T_ReactElement {
	if (variant === VARIANTS.STYLED) {
		return (
			<div className="dfr-Pre--styled root tw-rounded-md tw-border tw-p-4 tw-font-mono tw-text-base dfr-bg-color-secondary dfr-border-color-primary dark:dfr-bg-color-tertiary">
				<pre
					{...rest}
					className={classNames("tw-overflow-x-auto", className)}
				>
					{children}
				</pre>

				<style jsx>
					{`
						.root pre {
							word-break: keep-all;
							overflow-x: auto;
						}

						.root :global(.dfr-Code) {
							color: var(--dfr-text-color-gs-700);
							font-style: normal;
						}

						.root :global(.dfr-Code::before),
						.root :global(.dfr-Code::after) {
							content: "";
						}

						:global(.tw-dark) :global(.dfr-Pre--styled) :global(.dfr-Code) {
							color: var(--dfr-text-color-primary);
						}
					`}
				</style>
			</div>
		);
	}

	return (
		<pre
			className={classNames(
				`dfr-Pre--${variant}`,
				variant === VARIANTS.BREAK_WORDS && "tw-whitespace-normal tw-break-all",
				variant === VARIANTS.BREAK_WITH_BLANK_LINES && "tw-whitespace-pre-line tw-break-words",
				variant === VARIANTS.BREAK_WITH_BLANK_SPACES && "tw-whitespace-pre-wrap tw-break-words",
				className,
			)}
			{...rest}
		>
			{children}
		</pre>
	);
}

Pre.variant = VARIANTS;

export default Pre;
