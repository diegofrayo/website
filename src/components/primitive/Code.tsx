import * as React from "react";
import cn from "classnames";
import { cva } from "class-variance-authority";

import { CopyToClipboardPopover } from "~/components/shared";
import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "STYLED"]);
type T_Variant = keyof typeof VARIANTS;

type T_CodeProps = DR.DOM.HTMLElementAttributes["code"] & {
	variant?: T_Variant;
};

function Code({ variant = VARIANTS.UNSTYLED, children, className, ...rest }: T_CodeProps) {
	if (variant === VARIANTS.STYLED) {
		return (
			<CopyToClipboardPopover textToCopy={String(children)}>
				<code
					className={cn("dr-code dr-code--styled", styles({ variant }), className)}
					{...rest}
				>
					{children}
				</code>
			</CopyToClipboardPopover>
		);
	}

	return <code className={cn("dr-code", styles({ variant }), className)}>{children}</code>;
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
