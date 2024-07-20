import * as React from "react";
import * as Separator from "@radix-ui/react-separator";
import cn from "classnames";

import v from "@diegofrayo/v";
import { mirror } from "@diegofrayo/utils/arrays-and-objects";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "DASHED"]);
type T_Variant = keyof typeof VARIANTS;
type T_SpaceProps = {
	clasName?: string;
	variant?: T_Variant;
	orientation?: "h" | "v";
	responsive?: string;
	size?: number;
	sizeLeft?: number;
	sizeRight?: number;
	sizeTop?: number;
	sizeBottom?: number;
};

// --- COMPONENT DEFINITION ---

function Space({
	variant = VARIANTS.UNSTYLED,
	clasName = "",
	orientation = "h",
	responsive = "",
	size,
	sizeTop,
	sizeBottom,
	sizeLeft,
	sizeRight,
}: T_SpaceProps) {
	// --- VARS ---
	const isVerticalOrientation = orientation === "v";

	// --- UTILS ---
	function composeStyles() {
		return cn(
			`dr-space dr-space--${variant.toLowerCase()}`,
			"tw-flex-shrink-0",
			{ "tw-border-0": variant === VARIANTS.UNSTYLED },
			{ "tw-border-t tw-border-dashed dr-border-color-surface-300": variant === VARIANTS.DASHED },
			{ "tw-border-t dr-border-color-surface-300": variant === VARIANTS.SIMPLE },
			{ "tw-h-full": isVerticalOrientation },
			{ "tw-h-px": !isVerticalOrientation },
			v.isNotEmptyString(responsive) ? responsive : composeSizeStyles(),
			clasName,
		);
	}

	function composeSizeStyles() {
		if (isVerticalOrientation) {
			if (sizeLeft || sizeRight) {
				return cn(
					"tw-inline-block",
					composeSingleSideStyles("ml", sizeLeft),
					composeSingleSideStyles("mr", sizeRight),
				);
			}

			return cn("tw-inline-block", composeSingleSideStyles("mx", size));
		}

		if (sizeTop || sizeBottom) {
			return cn(composeSingleSideStyles("mt", sizeTop), composeSingleSideStyles("mb", sizeBottom));
		}

		return composeSingleSideStyles("my", size);
	}

	function composeSingleSideStyles(
		singleSide: "my" | "mt" | "mb" | "mx" | "ml" | "mr",
		singleSideSize?: number,
	) {
		if (v.isNumber(singleSideSize)) {
			return `tw-${singleSide}-${singleSideSize}`;
		}

		return "";
	}

	return (
		<Separator.Root
			className={composeStyles()}
			orientation={isVerticalOrientation ? "vertical" : "horizontal"}
		/>
	);
}

Space.variant = VARIANTS;

export default Space;
