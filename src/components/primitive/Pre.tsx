import * as React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";
import { highlight } from "sugar-high";

import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

const VARIANTS = mirror([
	"UNSTYLED",
	"STYLED",
	"HIGHLIGHTED",
	"BREAK_WITH_BLANK_LINES",
	"BREAK_WITH_BLANK_SPACES",
]);
type T_Variant = keyof typeof VARIANTS;
type T_PreProps = DR.DOM.HTMLElementAttributes["pre"] & {
	variant?: T_Variant;
};

// --- COMPONENT DEFINITION ---

function Pre({ children, className, variant = VARIANTS.UNSTYLED, ...rest }: T_PreProps) {
	// --- STATES & REFS ---
	const [highlightedCode, setHighlightedCode] = React.useState("");

	// --- VARS ---
	const isStyledVariant = variant === VARIANTS.STYLED;
	const isHighlightedVariant = variant === VARIANTS.HIGHLIGHTED;

	// --- EFFECTS ---
	React.useEffect(
		function highlightCode() {
			if (isStyledVariant || isHighlightedVariant) {
				setHighlightedCode(
					highlight(React.isValidElement(children) ? children.props.children : children),
				);
			}
		},
		[isStyledVariant, isHighlightedVariant, children],
	);

	if (isStyledVariant || isHighlightedVariant) {
		return (
			<pre
				className={cn(`dr-pre dr-pre--${variant.toLowerCase()}`, styles({ variant }), className)}
				dangerouslySetInnerHTML={{ __html: highlightedCode }}
			/>
		);
	}

	return (
		<pre
			className={cn(`dr-pre dr-pre--${variant.toLowerCase()}`, styles({ variant }), className)}
			{...rest}
		>
			{removeCodeElements(children)}
		</pre>
	);
}

Pre.variant = VARIANTS;

export default Pre;

// --- STYLES ---

const styles = cva("tw-overflow-auto tw-font-mono", {
	variants: {
		variant: {
			[VARIANTS.UNSTYLED]: "",
			[VARIANTS.STYLED]:
				"tw-rounded-md tw-border tw-p-4 dr-bg-color-surface-200 dr-border-color-surface-300",
			[VARIANTS.HIGHLIGHTED]: "tw-p-4 dr-bg-color-surface-200",
			[VARIANTS.BREAK_WITH_BLANK_LINES]: "tw-whitespace-pre-line tw-break-words",
			[VARIANTS.BREAK_WITH_BLANK_SPACES]: "tw-whitespace-pre-wrap tw-break-words",
		},
	},
});

// --- INTERNALS ---

function removeCodeElements(children: T_PreProps["children"]): DR.React.Children {
	return React.Children.map(children, (child) => {
		if (isInlineCodeElement(child)) {
			return child.props.children;
		}

		return child;
	});
}

function isInlineCodeElement(child: DR.React.Node): child is DR.React.JSXElement {
	/* WARN:
	 * I use this any because I get problems when the code is minified
	 * I can't do this validation using function.name
	 */
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return React.isValidElement(child) && (child.type as any).customName === "InlineCode";
}
