import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { blockquoteStyles } from "./blockquote.styles";

// --- PROPS & TYPES ---

type BlockquoteProps = ReactTypes.DOM.HTMLElementAttributes["blockquote"];

// --- COMPONENT DEFINITION ---

function Blockquote({ children, className, ...rest }: BlockquoteProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		root: cn("dr-blockquote", "border-l-4 pl-3", blockquoteStyles.root, className),
	};

	return (
		<blockquote
			className={classes.root}
			{...rest}
		>
			{children}
		</blockquote>
	);
}

export default Blockquote;
