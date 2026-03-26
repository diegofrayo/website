import { Separator } from "radix-ui";

import cn from "@diegofrayo-pkg/cn";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { isNotEmptyString, isNumber } from "@diegofrayo-pkg/validator";

// --- PROPS & TYPES ---

const VARIANTS = mirror(["UNSTYLED", "SIMPLE", "DASHED"]);
type Variant = keyof typeof VARIANTS;
type SpaceProps = {
	className?: string;
	variant?: Variant;
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
	className = "",
	orientation = "h",
	responsive = "",
	size,
	sizeTop,
	sizeBottom,
	sizeLeft,
	sizeRight,
}: SpaceProps) {
	// --- COMPUTED STATES ---
	const isVerticalOrientation = orientation === "v";
	const hasBorder = variant !== VARIANTS.UNSTYLED;

	// --- UTILS ---
	function composeStyles() {
		return cn(
			`dr-space dr-space--${variant.toLowerCase()}`,
			"shrink-0",
			{ "border-0": variant === VARIANTS.UNSTYLED },
			{ "border-dashed border-zinc-400": variant === VARIANTS.DASHED },
			{ "border-zinc-400": variant === VARIANTS.SIMPLE },
			{ "w-px": isVerticalOrientation },
			{ "h-px": !isVerticalOrientation },
			{ "border-l": hasBorder && isVerticalOrientation },
			{ "border-t": hasBorder && !isVerticalOrientation },
			isNotEmptyString(responsive) ? responsive : composeSizeStyles(),
			className,
		);
	}

	function composeSizeStyles() {
		if (isVerticalOrientation) {
			if (sizeLeft || sizeRight) {
				return cn(
					"inline-block",
					composeSingleSideStyles("ml", sizeLeft),
					composeSingleSideStyles("mr", sizeRight),
				);
			}

			return cn("inline-block", composeSingleSideStyles("mx", size));
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
		if (isNumber(singleSideSize)) {
			return `${singleSide}-${singleSideSize}`;
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
