import { cva } from "class-variance-authority";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import { Box, Icon, IconCatalog } from "../primitive";

const Variant = mirror(["WARNING", "ERROR"]);
type Variant = keyof typeof Variant;

type CalloutProps = {
	children: DR.React.Children;
	variant?: Variant;
};

function Callout({ children, variant = Variant.ERROR }: CalloutProps) {
	const isWarningVariant = variant === Variant.WARNING;

	const classes = {
		container: cn(
			`dr-callout dr-callout--${variant.toLowerCase()}`,
			"flex items-center justify-start rounded-lg p-4",
			styles({ variant }),
		),
	};

	return (
		<Box
			className={classes.container}
			data-markdown-block
		>
			<Box className="mr-4 shrink-0">
				{isWarningVariant ? (
					<Icon
						icon={IconCatalog.TRIANGLE_ALERT}
						size={24}
					/>
				) : (
					<Icon
						icon={IconCatalog.X}
						size={24}
					/>
				)}
			</Box>
			<Box className="flex-1">{children}</Box>
		</Box>
	);
}

Callout.variant = Variant;

export default Callout;

// --- STYLES ---

const styles = cva("", {
	variants: {
		variant: {
			[Variant.ERROR]: "border border-red-300 bg-red-100 text-red-700",
			[Variant.WARNING]: "border border-amber-300 bg-amber-100 text-amber-700",
		},
	},
});
