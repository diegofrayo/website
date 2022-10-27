import * as React from "react";
import classNames from "classnames";

import { copyToClipboard } from "~/utils/browser";
import { isArrayOf, isString } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_CodeProps = T_HTMLElementAttributes["code"];

function Code({ children, className, ...rest }: T_CodeProps): T_ReactElement {
	// handlers
	function handleClick(): void {
		if (isArrayOf(children, "string")) {
			copyToClipboard(children.join(""));
		} else if (isString(children)) {
			copyToClipboard(children);
		}
	}

	return (
		<code
			className={classNames(
				"dfr-Code tw-cursor-pointer tw-text-base tw-italic dfr-text-color-inline-code hover:tw-border-b hover:tw-border-dashed hover:dfr-border-color-inline-code",
				className,
			)}
			onClick={handleClick}
			role="button"
			tabIndex={0}
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

export default Code;
