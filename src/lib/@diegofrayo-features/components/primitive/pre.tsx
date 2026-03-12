import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

// --- PROPS & TYPES ---

const VARIANTS = mirror([
	"UNSTYLED",
	"BREAK_WITH_BLANK_LINES",
	"BREAK_WITH_BLANK_SPACES",
	"BREAK_WORDS",
]);
type Variant = keyof typeof VARIANTS;
type PreProps = DR.DOM.HTMLElementAttributes["pre"] & {
	variant?: Variant;
};

// --- COMPONENT DEFINITION ---

function Pre({ children, className, variant = VARIANTS.UNSTYLED, ...rest }: PreProps) {
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
			[VARIANTS.BREAK_WITH_BLANK_LINES]: "wrap-break-word whitespace-pre-line",
			[VARIANTS.BREAK_WITH_BLANK_SPACES]: "wrap-break-word whitespace-pre-wrap",
			[VARIANTS.BREAK_WORDS]: "break-all whitespace-normal",
		},
	},
});
