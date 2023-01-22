import * as React from "react";
import classNames from "classnames";

import v from "~/@diegofrayo/library/v";
import { copyToClipboard } from "~/@diegofrayo/library/utils/browser";
import type {
	T_HTMLElementAttributes,
	T_ReactElement,
	T_ReactOnClickEventHandler,
} from "~/@diegofrayo/library/types/react";

type T_CodeProps = T_HTMLElementAttributes["code"];

function Code(props: T_CodeProps): T_ReactElement {
	const {
		// props
		className,
		children,
		htmlAttributes,

		// handlers
		handleClick,
	} = useCode(props);

	return (
		<code
			className={classNames(
				"tw-cursor-pointer tw-text-base tw-italic hover:tw-border-b hover:tw-border-dashed",
				className,
			)}
			onClick={handleClick}
			role="button"
			tabIndex={0}
			{...htmlAttributes}
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

// --- Controller ---

type T_UseCodeReturn = {
	// props
	className: T_CodeProps["className"];
	children: T_CodeProps["children"];
	htmlAttributes: Omit<T_CodeProps, "className" | "children">;

	// handlers
	handleClick: T_ReactOnClickEventHandler;
};

function useCode({ children, className, ...htmlAttributes }: T_CodeProps): T_UseCodeReturn {
	// handlers
	function handleClick(): void {
		if (v.isArrayOf(children, "string")) {
			copyToClipboard(children.join(""));
		} else if (v.isString(children)) {
			copyToClipboard(children);
		}
	}

	return {
		// props
		className,
		children,
		htmlAttributes,

		// handlers
		handleClick,
	};
}
