import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import CopyToClipboardPopover from "../shared/copy-to-clipboard-popover";
import Button from "./button";

// --- PROPS & TYPES ---

const Variant = mirror(["UNSTYLED", "ENHANCED"]);
type Variant = keyof typeof Variant;
type CodeProps = DR.DOM.HTMLElementAttributes["code"] & {
	children: string;
	variant?: Variant;
};

// --- COMPONENT DEFINITION ---

function Code({ children, className, variant = Variant.UNSTYLED }: CodeProps) {
	const classes = {
		codeElement: cn(`dr-code dr-code--${variant.toLowerCase()}`, styles({ variant }), className),
	};

	if (variant === Variant.ENHANCED) {
		return (
			<CopyToClipboardPopover textToCopy={children}>
				<Button variant={Button.variant.SMOOTH}>
					<code className={classes.codeElement}>{children}</code>
				</Button>
			</CopyToClipboardPopover>
		);
	}

	return <code className={classes.codeElement}>{children}</code>;
}

Code.variant = Variant;

export default Code;

// --- STYLES ---

const styles = cva("text-left font-mono", {
	variants: {
		variant: {
			[Variant.UNSTYLED]: "",
			[Variant.ENHANCED]:
				"inline-block rounded-md bg-amber-300 px-1.5 py-0.5 text-sm font-bold text-amber-700",
		},
	},
});
