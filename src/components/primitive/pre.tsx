import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const PreVariants = keyMirror([
	"UNSTYLED",
	"BREAK_WITH_BLANK_LINES",
	"BREAK_WITH_BLANK_SPACES",
	"BREAK_WORDS",
]);
type PreVariant = keyof typeof PreVariants;
type PreProps = ReactTypes.DOM.HTMLElementAttributes["pre"] & {
	variant?: PreVariant;
};

// --- COMPONENT DEFINITION ---

function Pre({
	children,
	className,
	variant = PreVariants.UNSTYLED,
	...rest
}: PreProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		root: cn(`dr-pre dr-pre--${variant.toLowerCase()}`, styles({ variant }), className),
	};

	return (
		<pre
			className={classes.root}
			{...rest}
		>
			{children}
		</pre>
	);
}

export { PreVariants, type PreVariant };

export default Pre;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[PreVariants.UNSTYLED]: "",
			[PreVariants.BREAK_WITH_BLANK_LINES]: "wrap-break-word whitespace-pre-line",
			[PreVariants.BREAK_WITH_BLANK_SPACES]: "wrap-break-word whitespace-pre-wrap",
			[PreVariants.BREAK_WORDS]: "break-all whitespace-normal",
		},
	},
});
