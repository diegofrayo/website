import { Separator as BaseUISeparator } from "@base-ui/react/separator";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { isNumber } from "@diegofrayo-pkg/validator";

// --- PROPS & TYPES ---

const SeparatorVariant = mirror(["UNSTYLED", "SIMPLE", "DASHED"]);

type SeparatorVariant = keyof typeof SeparatorVariant;

type SeparatorProps =
	| {
			orientation?: "HORIZONTAL";
			className?: string;
			variant?: SeparatorVariant;
			size?: number;
			sizeTop?: number;
			sizeBottom?: number;
	  }
	| {
			orientation: "VERTICAL";
			className?: string;
			variant?: SeparatorVariant;
			size?: number;
			sizeLeft?: number;
			sizeRight?: number;
	  };

// --- COMPONENT DEFINITION ---

function Separator({
	variant = SeparatorVariant.UNSTYLED,
	className = "",
	size,
	...props
}: SeparatorProps): ReactTypes.JSXElement {
	// --- COMPUTED STATES ---
	const isVerticalOrientation = props.orientation === "VERTICAL";
	const hasBorder = variant !== SeparatorVariant.UNSTYLED;

	// --- UTILS ---
	function composeStyles(): string {
		return cn(
			`dr-space dr-space--${variant.toLowerCase()}`,
			"shrink-0",
			{ "border-0": variant === SeparatorVariant.UNSTYLED },
			{ "border-dashed border-zinc-400": variant === SeparatorVariant.DASHED },
			{ "border-zinc-400": variant === SeparatorVariant.SIMPLE },
			{ "w-px": isVerticalOrientation },
			{ "h-px": !isVerticalOrientation },
			{ "border-l": hasBorder && isVerticalOrientation },
			{ "border-t": hasBorder && !isVerticalOrientation },
			composeSizeStyles(),
			className,
		);
	}

	function composeSizeStyles(): string {
		if (props.orientation === "HORIZONTAL" || props.orientation === undefined) {
			if (props.sizeTop || props.sizeBottom) {
				return cn(
					composeSingleSideStyles("mt", props.sizeTop),
					composeSingleSideStyles("mb", props.sizeBottom),
				);
			}

			return composeSingleSideStyles("my", size);
		}

		if (props.orientation === "VERTICAL") {
			if (props.sizeLeft || props.sizeRight) {
				return cn(
					composeSingleSideStyles("ml", props.sizeLeft),
					composeSingleSideStyles("mr", props.sizeRight),
				);
			}

			return composeSingleSideStyles("mx", size);
		}

		return "";
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

	return (
		<BaseUISeparator
			className={composeStyles()}
			orientation={isVerticalOrientation ? "vertical" : "horizontal"}
		/>
	);
}

export default Separator;

export { SeparatorVariant };
