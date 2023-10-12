import * as React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";

import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "BREAK_WITH_BLANK_LINES", "BREAK_WITH_BLANK_SPACES"]);
type T_Variant = keyof typeof VARIANTS;
type T_PreProps = DR.DOM.HTMLElementAttributes["pre"] & {
	variant?: T_Variant;
};

// --- COMPONENT DEFINITION ---

function Pre({ children, className, variant = VARIANTS.UNSTYLED, ...rest }: T_PreProps) {
	return (
		<pre
			className={cn(`dr-pre dr-pre--${variant.toLowerCase()}`, styles({ variant }), className)}
			{...rest}
		>
			{children}
		</pre>
	);
}

Pre.variant = VARIANTS;

export default Pre;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[VARIANTS.UNSTYLED]: "",
			[VARIANTS.BREAK_WITH_BLANK_LINES]: "tw-whitespace-pre-line tw-break-words",
			[VARIANTS.BREAK_WITH_BLANK_SPACES]: "tw-whitespace-pre-wrap tw-break-words",
		},
	},
});
