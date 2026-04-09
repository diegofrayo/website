import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const Variant = mirror(["UNSTYLED", "STYLED"]);
type Variant = keyof typeof Variant;
type CodeProps = ReactTypes.DOM.HTMLElementAttributes["code"] & {
	children: string;
	variant?: Variant;
};

// --- COMPONENT DEFINITION ---

function Code({ children, className, variant = Variant.UNSTYLED }: CodeProps) {
	const classes = {
		codeElement: cn(`dr-code dr-code--${variant.toLowerCase()}`, styles({ variant }), className),
	};

	return <code className={classes.codeElement}>{children}</code>;
}

Code.variant = Variant;

export default Code;

// --- STYLES ---

const styles = cva("text-left font-mono", {
	variants: {
		variant: {
			[Variant.UNSTYLED]: "",
			[Variant.STYLED]:
				"inline-block rounded-md bg-amber-300 px-1.5 py-0.5 text-sm font-bold text-amber-700",
		},
	},
});
