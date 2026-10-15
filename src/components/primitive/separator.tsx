import { Separator as BaseUISeparator } from "@base-ui/react/separator";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { keyMirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { isNumber } from "@diegofrayo-pkg/validator";

// --- PROPS & TYPES ---

const SeparatorVariants = keyMirror(["UNSTYLED", "SIMPLE", "DASHED"]);

type SeparatorVariant = keyof typeof SeparatorVariants;

type HorizontalSeparatorProps = {
	className?: string;
	orientation?: "HORIZONTAL";
	size?: number;
	sizeBottom?: number;
	sizeTop?: number;
	variant?: SeparatorVariant;
};

type VerticalSeparatorProps = {
	orientation: "VERTICAL";
	className?: string;
	size?: number;
	sizeLeft?: number;
	sizeRight?: number;
	variant?: SeparatorVariant;
};

type SeparatorProps = HorizontalSeparatorProps | VerticalSeparatorProps;

// --- COMPONENT DEFINITION ---

function Separator(props: SeparatorProps): ReactTypes.JSXElement {
	const { className = "", variant = SeparatorVariants.UNSTYLED } = props;

	// --- COMPUTED STATES ---
	const isVerticalOrientation = props.orientation === "VERTICAL";
	const hasBorder = variant !== SeparatorVariants.UNSTYLED;

	// --- STYLES ---
	const classes = {
		root: cn(
			`dr-separator dr-separator--${variant.toLowerCase()}`,
			"shrink-0",
			{ "border-0": variant === SeparatorVariants.UNSTYLED },
			{ "border-dashed border-zinc-400": variant === SeparatorVariants.DASHED },
			{ "border-zinc-400": variant === SeparatorVariants.SIMPLE },
			{ "w-px": isVerticalOrientation },
			{ "h-px": !isVerticalOrientation },
			{ "border-l": hasBorder && isVerticalOrientation },
			{ "border-t": hasBorder && !isVerticalOrientation },
			composeSizeStyles(props),
			className,
		),
	};

	return (
		<BaseUISeparator
			className={classes.root}
			orientation={isVerticalOrientation ? "vertical" : "horizontal"}
		/>
	);
}

export { SeparatorVariants, type SeparatorVariant };

export default Separator;

// --- UTILS ---

function composeSizeStyles(props: SeparatorProps): string {
	if (props.orientation === "VERTICAL") {
		if (isNumber(props.sizeLeft) || isNumber(props.sizeRight)) {
			return cn(
				composeSingleSideStyles("ml", props.sizeLeft),
				composeSingleSideStyles("mr", props.sizeRight),
			);
		}

		return composeSingleSideStyles("mx", props.size);
	}

	if (isNumber(props.sizeTop) || isNumber(props.sizeBottom)) {
		return cn(
			composeSingleSideStyles("mt", props.sizeTop),
			composeSingleSideStyles("mb", props.sizeBottom),
		);
	}

	return composeSingleSideStyles("my", props.size);
}

function composeSingleSideStyles(
	singleSide: "my" | "mt" | "mb" | "mx" | "ml" | "mr",
	singleSideSize?: number,
): string {
	if (isNumber(singleSideSize)) {
		return `${singleSide}-${singleSideSize}`;
	}

	return "";
}
