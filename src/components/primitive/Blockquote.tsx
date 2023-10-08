import * as React from "react";
import cn from "classnames";

import type DR from "@diegofrayo/types";

type T_BlockquoteProps = DR.DOM.HTMLElementAttributes["blockquote"];

function Blockquote({ children, className, ...rest }: T_BlockquoteProps) {
	return (
		<blockquote
			className={cn(
				"dr-blockquote",
				"tw-border-l-4 tw-pl-3 dr-border-color-surface-300 dr-text-color-surface-500",
				className,
			)}
			{...rest}
		>
			{children}
		</blockquote>
	);
}

export default Blockquote;
