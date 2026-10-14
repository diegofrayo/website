import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { codeStyles, CodeVariant } from "./code.styles";

// --- PROPS & TYPES ---

type CodeProps = ReactTypes.DOM.HTMLElementAttributes["code"] & {
	children: string;
	variant?: CodeVariant;
};

// --- COMPONENT DEFINITION ---

function Code({
	children,
	className,
	variant = CodeVariant.UNSTYLED,
}: CodeProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		codeElement: cn(`dr-code dr-code--${variant.toLowerCase()}`, codeStyles({ variant }), className),
	};

	return <code className={classes.codeElement}>{children}</code>;
}

Code.variant = CodeVariant;

export default Code;
