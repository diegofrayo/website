import * as React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";

import CopyToClipboardPopover from "~/components/shared/CopyToClipboardPopover";
import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

import Button from "./Button";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "STYLED"]);
type T_Variant = keyof typeof VARIANTS;
type T_CodeProps = DR.DOM.HTMLElementAttributes["code"] & {
	children: string;
	variant?: T_Variant;
};

// --- COMPONENT DEFINITION ---

function Code({ variant = VARIANTS.UNSTYLED, children, className }: T_CodeProps) {
	if (variant === VARIANTS.STYLED) {
		return (
			<CopyToClipboardPopover textToCopy={children}>
				<Button variant={Button.variant.SIMPLE}>
					<code
						className={cn(
							`dr-code dr-code--${variant.toLowerCase()}`,
							styles({ variant }),
							className,
						)}
					>
						{children}
					</code>
				</Button>
			</CopyToClipboardPopover>
		);
	}

	return (
		<code
			className={cn(`dr-code dr-code--${variant.toLowerCase()}`, styles({ variant }), className)}
		>
			{children}
		</code>
	);
}

Code.variant = VARIANTS;

export default Code;

// --- STYLES ---

const styles = cva("tw-text-left tw-font-mono", {
	variants: {
		variant: {
			[VARIANTS.UNSTYLED]: "",
			[VARIANTS.STYLED]:
				"tw-inline-block tw-rounded-md tw-px-1.5 tw-py-0.5 tw-text-sm dr-text-color-primary-100 dr-bg-color-surface-mixed-200",
		},
	},
});
