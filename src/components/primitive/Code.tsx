import * as React from "react";
import classNames from "classnames";

import { copyToClipboard } from "~/utils/browser";
import { mirror } from "~/utils/objects-and-arrays";
import { isArray } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

const VARIANTS = mirror(["MDX", "MARKDOWN"]);
type T_Variant = keyof typeof VARIANTS;
type T_CodeProps = T_HTMLElementAttributes["code"] & { variant?: T_Variant };

function Code({
	children,
	className,
	variant = VARIANTS.MDX,
	...rest
}: T_CodeProps): T_ReactElement {
	if (variant === VARIANTS.MDX) {
		return (
			<code
				className={classNames(
					"dfr-Code tw-text-base tw-italic dfr-text-color-inline-code",
					className,
				)}
				{...rest}
			>
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

	// handlers
	function handleClick(): void {
		if (isArray<string>(children)) {
			copyToClipboard(children.join(""));
		}
	}

	return (
		<code
			className={classNames(
				"dfr-Code tw-cursor-pointer tw-rounded-sm tw-px-1 tw-py-0.5 tw-font-mono tw-text-sm dfr-bg-color-inline-code dfr-text-color-gs-white",
				className,
			)}
			onClick={handleClick}
			role="button"
			tabIndex={0}
			{...rest}
		>
			{children}
		</code>
	);
}

Code.variant = VARIANTS;

export default Code;
