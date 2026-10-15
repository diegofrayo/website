import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import { Box, Icon } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

const CalloutVariants = keyMirror(["WARNING", "ERROR"]);
type CalloutVariant = keyof typeof CalloutVariants;

type CalloutProps = {
	children: ReactTypes.Children;

	variant?: CalloutVariant;
};

function Callout({ children, variant = CalloutVariants.ERROR }: CalloutProps): ReactTypes.JSXElement {
	// --- COMPUTED STATES ---
	const isWarningVariant = variant === CalloutVariants.WARNING;
	const iconName = isWarningVariant ? IconCatalog.TRIANGLE_ALERT : IconCatalog.X;

	// --- STYLES ---
	const classes = {
		container: cn(
			`dr-callout dr-callout--${variant.toLowerCase()}`,
			"flex items-center justify-start rounded-lg p-4",
			styles({ variant }),
		),
		icon: cn("mr-4 shrink-0"),
		content: cn("flex-1"),
	};

	return (
		<Box
			className={classes.container}
			data-markdown-block
		>
			<Box className={classes.icon}>
				<Icon
					name={iconName}
					size={24}
				/>
			</Box>
			<Box className={classes.content}>{children}</Box>
		</Box>
	);
}

export { CalloutVariants, type CalloutVariant };

export default Callout;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[CalloutVariants.ERROR]: "border border-red-300 bg-red-100 text-red-700",
			[CalloutVariants.WARNING]: "border border-amber-300 bg-amber-100 text-amber-700",
		},
	},
});
