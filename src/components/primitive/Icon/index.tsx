import * as React from "react";
import cn from "classnames";

import { logger } from "~/modules/logging";
import type DR from "@diegofrayo/types";
import { getObjectKeys, mirror } from "@diegofrayo/utils/arrays-and-objects";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

import ICONS from "./constants";
import Block from "../Block";
import Image from "../Image";

// --- PROPS & TYPES ---

export type T_IconName = keyof typeof ICONS;

interface I_LibraryIcon {
	icon: T_LibraryIconComponent;
	defaultProps: {
		className?: string;
		color?: string;
		size?: number;
	};
}

interface I_CustomIcon {
	icon: string;
	defaultProps: {
		alt: string;
		className?: string;
		color?: string;
		size?: number;
	};
}

type T_Icon = I_LibraryIcon | I_CustomIcon;

type T_LibraryIconComponent = (props: React.ComponentProps<"svg">) => DR.React.JSXElement;

type T_IconProps = {
	icon: T_IconName;
	size?: number | string; // number: for width and height attrs | string: for className attr
	color?: string;
	iconClassName?: string;
	wrapperClassName?: string;
	wrapperProps?: DR.Object;
};

// --- COMPONENT DEFINITION ---

function Icon({
	icon: iconName,
	size = undefined,
	color = undefined,
	iconClassName = "",
	wrapperClassName = "",
	wrapperProps: wrapperPropsProp = {},
}: T_IconProps) {
	// --- VARS ---
	const icon = ICONS[iconName] as T_Icon;
	const wrapperProps = {
		className: cn("dr-icon", wrapperClassName),
		...wrapperPropsProp,
	};

	// --- UTILS ---
	function getLibraryIconColorStyles() {
		if (v.isNotEmptyString(color)) {
			return color;
		}

		if (v.isNotEmptyString(icon.defaultProps.color)) {
			return icon.defaultProps.color;
		}

		return "";
	}

	function getIconSizeStyles(defaultSize: number) {
		if (v.isNumber(size)) {
			return { width: size, height: size };
		}

		if (v.isNumber(icon.defaultProps.size)) {
			return { width: icon.defaultProps.size, height: icon.defaultProps.size };
		}

		return { width: defaultSize, height: defaultSize };
	}

	if (v.isUndefined(icon)) {
		logger("WARN", "Icon does not exist", iconName);
		return null;
	}

	const iconBaseStyles = cn(
		"tw-inline-block",
		icon.defaultProps.className,
		iconClassName,
		v.isString(size) && size,
	);

	if (isLibraryIcon(icon)) {
		const iconComponentProps = {
			className: cn(iconBaseStyles, getLibraryIconColorStyles(), `icon--${generateSlug(iconName)}`),
			...getIconSizeStyles(16),
		};
		const IconComponent = icon.icon;

		return (
			<Wrapper {...wrapperProps}>
				<IconComponent {...iconComponentProps} />
			</Wrapper>
		);
	}

	if (isCustomIcon(icon)) {
		const iconComponentProps = {
			alt: `${icon.defaultProps.alt} icon`,
			src: icon.icon,
			className: cn(iconBaseStyles),
			...getIconSizeStyles(24),
		};
		const IconComponent = Image;

		return (
			<Wrapper {...wrapperProps}>
				<IconComponent {...iconComponentProps} />
			</Wrapper>
		);
	}

	logger("WARN", "Invalid props combinations", {
		icon,
		size,
		color,
		iconClassName,
		wrapperClassName,
	});

	return null;
}

Icon.icon = mirror(getObjectKeys(ICONS));

export default Icon;

// --- COMPONENTS ---

function Wrapper({ children, className = "" }: DR.DOM.HTMLElementAttributes["span"]) {
	return (
		<Block
			is="span"
			className={cn("tw-inline-flex tw-items-center tw-justify-center tw-align-middle", className)}
		>
			{children}
		</Block>
	);
}

// --- INTERNALS ---

function isLibraryIcon(iconConfig: T_Icon): iconConfig is I_LibraryIcon {
	return !v.isString(iconConfig.icon);
}

function isCustomIcon(iconConfig: T_Icon): iconConfig is I_CustomIcon {
	return v.isString(iconConfig.icon);
}
