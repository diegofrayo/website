import * as React from "react";
import classNames from "classnames";

import { logger } from "~/features/logging";
import v from "~/lib/v";
import { getObjectKeys, mirror } from "~/utils/objects-and-arrays";
import type { T_HTMLElementAttributes, T_ReactElement, T_ReactElementNullable } from "~/types";

import { ICONS } from "./constants";
import isIconElementFromLibraryChecker from "./utils";
import type { T_IconName, T_Icon } from "./types";

import Image from "../Image";
import Block from "../Block";

type T_IconProps = {
	icon: T_IconName;
	size?: number | string; // number: width | string: className
	color?: string;
	iconClassName?: string;
	wrapperClassName?: string;
	withBackgroundWhenDarkMode?: boolean;
};

function Icon({
	icon: iconName,
	size = undefined,
	color = undefined,
	iconClassName = "",
	wrapperClassName = "",
	withBackgroundWhenDarkMode = false,
}: T_IconProps): T_ReactElementNullable {
	// --- VARS ---
	/*
	 * This assertion is undesirable but necessary because I'm typing
	 * the icons keys object in a different way in comparison to the
	 * other components
	 */
	const icon = ICONS[iconName] as T_Icon;
	const wrapperProps = {
		className: classNames(
			"dfr-Icon",
			withBackgroundWhenDarkMode &&
				"dark:dfr-bg-color-gs-white dark:tw-rounded-full tw-overflow-hidden",
			wrapperClassName,
		),
	};

	// --- UTILS ---
	function getColorStyles(): string {
		if (v.isNotEmptyString(color)) {
			return color;
		}

		if (v.isNotEmptyString(icon.defaultProps.color)) {
			return icon.defaultProps.color;
		}

		return "dfr-text-color-bw";
	}

	if (v.isUndefined(icon)) {
		logger("WARN", "Icon does not exist", iconName);
		return null;
	}

	if (isIconElementFromLibraryChecker(icon.icon)) {
		const baseIconClassNames = classNames(
			"tw-inline-block",
			icon.defaultProps.className,
			iconClassName,
			v.isUndefined(size) && "tw-w-4 tw-h-4",
			v.isString(size) && size,
		);
		const iconComponentProps = {
			className: classNames(baseIconClassNames, getColorStyles()),
			...(v.isNumber(size) ? { style: { width: size, height: size } } : {}),
		};
		const IconComponent = icon.icon;

		return (
			<Wrapper {...wrapperProps}>
				<IconComponent {...iconComponentProps} />
			</Wrapper>
		);
	}

	if (v.isString(size)) {
		throw new Error(`Size value for "${iconName}" has to be a number`);
	}

	const baseIconClassNames = classNames(
		"tw-inline-block",
		icon.defaultProps.className,
		iconClassName,
	);
	const iconComponentProps = {
		src: icon.icon,
		alt: `${icon.defaultProps.alt} icon`,
		className: classNames(baseIconClassNames, withBackgroundWhenDarkMode && "dark:tw-p-0.5"),
		width: v.isNumber(size) ? size : 24,
		height: v.isNumber(size) ? size : 24,
	};
	const IconComponent = Image;

	return (
		<Wrapper {...wrapperProps}>
			<IconComponent {...iconComponentProps} />
		</Wrapper>
	);
}

Icon.icon = mirror(getObjectKeys(ICONS));

export default Icon;
export type { T_IconName };

// --- COMPONENTS ---

function Wrapper({ children, className = "" }: T_HTMLElementAttributes["span"]): T_ReactElement {
	return (
		<Block
			is="span"
			className={classNames(
				"tw-inline-flex tw-items-center tw-justify-center tw-align-middle",
				className,
			)}
		>
			{children}
		</Block>
	);
}
