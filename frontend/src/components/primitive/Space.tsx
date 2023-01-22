import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/@diegofrayo/library/utils/objects-and-arrays";
import { T_HTMLElementAttributes, T_ReactElement } from "~/@diegofrayo/library/types/react";
import v from "~/@diegofrayo/library/v";

const VARIANTS = mirror(["DEFAULT", "DASHED"]);
type T_Variant = keyof typeof VARIANTS;

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_SpaceProps = T_HTMLElementAttributes["hr"] & {
	className?: string;
	variant?: T_Variant;
	orientation?: "h" | "v";
	responsive?: string;
	size?: number;
	sizeLeft?: number;
	sizeRight?: number;
	sizeTop?: number;
	sizeBottom?: number;
};

function Space(props: T_SpaceProps): T_ReactElement {
	const { className } = useSpace(props);

	return <hr className={className} />;
}

Space.variant = VARIANTS;

export default Space;

// --- Controller ---

type T_UseSpaceReturn = { className: string };

function useSpace({
	className = "",
	variant = VARIANTS.DEFAULT,
	orientation = "h",
	responsive = "",
	size,
	sizeTop,
	sizeBottom,
	sizeLeft,
	sizeRight,
}: T_SpaceProps): T_UseSpaceReturn {
	// vars
	const isVerticalOrientation = orientation === "v";

	// utils
	function composeClassName(): string {
		return classNames(
			"tw-flex-shrink-0",
			isVerticalOrientation ? "tw-h-full" : "tw-h-px",
			v.isNotEmptyString(responsive)
				? responsive
				: classNames(composeSizeClassNames(), isVerticalOrientation && "tw-inline-block"),
			variant === VARIANTS.DEFAULT && "tw-border-0",
			variant === VARIANTS.DASHED && "tw-border-dashed",
			className,
		);
	}

	function composeSizeClassNames(): string {
		if (isVerticalOrientation) {
			if (sizeLeft || sizeRight) {
				return `${composeSingleSideClassName("ml", sizeLeft)} ${composeSingleSideClassName(
					"mr",
					sizeRight,
				)}`.trim();
			}

			return composeSingleSideClassName("mx", size);
		}

		if (sizeTop || sizeBottom) {
			return `${composeSingleSideClassName("mt", sizeTop)} ${composeSingleSideClassName(
				"mb",
				sizeBottom,
			)}`.trim();
		}

		return composeSingleSideClassName("my", size);
	}

	function composeSingleSideClassName(singleSide: string, singleSideSize?: number): string {
		if (v.isNumber(singleSideSize)) {
			return `tw-${singleSide}-${singleSideSize}`;
		}

		return "";
	}

	return {
		className: composeClassName(),
	};
}
