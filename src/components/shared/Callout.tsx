import * as React from "react";
import { cva } from "class-variance-authority";
import cn from "classnames";

import { Block, Icon } from "~/components/primitive";
import { mirror } from "@diegofrayo/utils/arrays-and-objects";
import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["WARNING", "ERROR"]);
type T_Variant = keyof typeof VARIANTS;

type T_CalloutProps = {
	children: DR.React.Children;
	variant?: T_Variant;
};

// --- COMPONENT DEFINITION ---

function Callout({ children, variant }: T_CalloutProps) {
	return (
		<Block
			className={cn(
				"tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-p-4",
				styles({ variant }),
			)}
			data-markdown-block
		>
			<Block className="tw-mr-4 tw-flex-shrink-0">
				{variant === "WARNING" ? (
					<Icon
						icon={Icon.icon.WARNING}
						color="dr-text-color-primary-600"
						size={24}
					/>
				) : (
					"x"
				)}
			</Block>
			<Block>{children}</Block>
		</Block>
	);
}

Callout.variant = VARIANTS;

export default Callout;

// --- STYLES ---

const styles = cva("dr-callout", {
	variants: {
		variant: {
			[VARIANTS.ERROR]: "",
			[VARIANTS.WARNING]: "dr-text-color-primary-600 dr-bg-color-surface-mixed-400",
		},
	},
});
