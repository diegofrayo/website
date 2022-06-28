import * as React from "react";
import classNames from "classnames";

import { logger } from "~/utils/app";
import { mirror } from "~/utils/objects-and-arrays";
import { isNotEmptyString, isNumber, isString, isUndefined } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElement, T_ReactElementNullable } from "~/types";

import { ICONS } from "./constants";
import type { T_IconName, T_LibraryIconComponent, T_Icon } from "./types";
import isIconElementFromLibrary from "./utils";
import Image, { T_ImagePrimitiveComponent } from "../Image";
import Block from "../Block";

type T_IconProps = {
	icon: T_IconName;
	size?: number | string; // number: width | string: className
	color?: string;
	iconClassName?: string;
	wrapperClassName?: string;
	withBackgroundWhenDarkMode?: boolean;
};

function Icon(props: T_IconProps): T_ReactElementNullable {
	const { wrapperProps, iconComponentProps, IconComponent } = useController(props);

	if (isUndefined(IconComponent)) {
		return null;
	}

	return (
		<Wrapper {...wrapperProps}>
			<IconComponent {...iconComponentProps} />
		</Wrapper>
	);
}

Icon.icon = mirror<keyof typeof ICONS>(Object.keys(ICONS) as T_IconName[]);

export default Icon;
export type { T_IconName };

// --- Controller ---

type T_UseControllerReturn = {
	wrapperProps: { className: string } | undefined;
	iconComponentProps:
		| {
				src?: string;
				alt?: string;
				className: string;
				style?: { width: number; height: number };
		  }
		| undefined;
	IconComponent: T_LibraryIconComponent | T_ImagePrimitiveComponent | undefined;
};

function useController({
	icon: iconName,
	size = undefined,
	color = undefined,
	iconClassName = "",
	wrapperClassName = "",
	withBackgroundWhenDarkMode = false,
}: T_IconProps): T_UseControllerReturn {
	if (isUndefined(ICONS[iconName])) {
		logger("WARN", "Icon does not exist", iconName);

		return {
			wrapperProps: undefined,
			iconComponentProps: undefined,
			IconComponent: undefined,
		};
	}

	// vars
	/*
	 * This assertion is undesirable but necessary because I'm typing
	 * the icons keys object in a different way in comparison to the
	 * other components
	 */
	const icon = ICONS[iconName] as T_Icon;
	const baseIconClassNames = classNames(
		"tw-inline-block",
		isUndefined(size) && "tw-w-4 tw-h-4",
		isString(size) && size,
		icon.defaultProps.className,
		iconClassName,
	);
	const wrapperProps = {
		className: classNames(
			"dfr-Icon",
			withBackgroundWhenDarkMode &&
				"dark:dfr-bg-color-light-strong dark:tw-rounded-full tw-overflow-hidden",
			wrapperClassName,
		),
	};
	const iconComponentProps = isIconElementFromLibrary(icon.icon)
		? {
				className: classNames(baseIconClassNames, getColorStyles()),
				...(isNumber(size) ? { style: { width: size, height: size } } : {}),
		  }
		: {
				src: icon.icon,
				alt: `${icon.defaultProps.alt} icon`,
				className: classNames(baseIconClassNames, withBackgroundWhenDarkMode && "dark:tw-p-0.5"),
				...(isNumber(size) ? { style: { width: size, height: size } } : {}),
		  };
	const IconComponent = isIconElementFromLibrary(icon.icon) ? icon.icon : Image;

	// utils
	function getColorStyles(): string {
		if (isNotEmptyString(color)) {
			return color;
		}

		if (isNotEmptyString(icon.defaultProps.color)) {
			return icon.defaultProps.color;
		}

		return "dfr-text-color-dark-strong dark:dfr-text-color-light-strong";
	}

	return { wrapperProps, iconComponentProps, IconComponent };
}

// --- Components ---

function Wrapper({ children, className = "" }: T_HTMLElementAttributes["span"]): T_ReactElement {
	return (
		<Block
			className={classNames(
				"tw-inline-flex tw-items-center tw-justify-center tw-align-middle",
				className,
			)}
		>
			{children}
		</Block>
	);
}
