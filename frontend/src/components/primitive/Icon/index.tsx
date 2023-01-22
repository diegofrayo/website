import * as React from "react";
import classNames from "classnames";

import { ThrowError } from "~/components/shared";
import v from "~/@diegofrayo/library/v";
import { getObjectKeys, mirror } from "~/@diegofrayo/library/utils/objects-and-arrays";
import type {
	T_HTMLElementAttributes,
	T_ReactElement,
	T_ReactElementNullable,
} from "~/@diegofrayo/library/types/react";

import { ICONS } from "./constants";
import type { T_IconName, T_Icon, T_LibraryIcon, T_ImageIcon } from "./types";

import Block from "../Block";
import Image from "../Image";

type T_IconProps = {
	icon: T_IconName;
	size?: number | string; // number: width | string: className
	color?: string;
	iconClassName?: string;
	wrapperClassName?: string;
	withBackgroundWhenDarkMode?: boolean;
};

function Icon(props: T_IconProps): T_ReactElementNullable {
	// hooks
	const {
		// props
		size,
		color,
		wrapperClassName,
		iconClassName,
		withBackgroundWhenDarkMode,

		// vars
		icon,
		iconName,

		// utils
		isLibraryIcon,
		isImageIcon,
	} = useIcon(props);

	// render
	if (v.isUndefined(icon)) {
		return <ThrowError message={`Icon "${iconName}" doesn't exist`} />;
	}

	return (
		<Wrapper
			className={wrapperClassName}
			withBackgroundWhenDarkMode={withBackgroundWhenDarkMode}
		>
			{isLibraryIcon(icon) ? (
				<LibraryIcon
					icon={icon}
					iconClassName={iconClassName}
					size={size}
					color={color}
				/>
			) : isImageIcon(icon) ? (
				<ImageIcon
					icon={icon}
					iconName={iconName}
					iconClassName={iconClassName}
					size={size}
					withBackgroundWhenDarkMode={withBackgroundWhenDarkMode}
				/>
			) : (
				<ThrowError />
			)}
		</Wrapper>
	);
}

Icon.icon = mirror(getObjectKeys(ICONS));

export default Icon;

export type { T_IconName };

// --- Controller ---

function useIcon({
	icon: iconName,
	size,
	color = "",
	wrapperClassName = "",
	iconClassName = "",
	withBackgroundWhenDarkMode = false,
}: T_IconProps) {
	// vars
	const icon = ICONS[iconName];

	// utils
	function isLibraryIcon(input: T_Icon): input is T_LibraryIcon {
		return !v.isString(input.icon);
	}

	function isImageIcon(input: T_Icon): input is T_ImageIcon {
		return !isLibraryIcon(input);
	}

	return {
		// props
		size,
		color,
		wrapperClassName,
		iconClassName,
		withBackgroundWhenDarkMode,

		// vars
		icon,
		iconName,

		// utils
		isLibraryIcon,
		isImageIcon,
	};
}

// --- Components ---

type T_WrapperProps = T_HTMLElementAttributes["span"] &
	Pick<T_IconProps, "withBackgroundWhenDarkMode">;

function Wrapper({
	children,
	className,
	withBackgroundWhenDarkMode,
}: T_WrapperProps): T_ReactElement {
	return (
		<Block
			is="span"
			className={classNames(
				"tw-inline-flex tw-items-center tw-justify-center tw-align-middle",
				withBackgroundWhenDarkMode && "tw-overflow-hidden dark:tw-rounded-full",
				className,
			)}
		>
			{children}
		</Block>
	);
}

type T_LibraryIconProps = {
	icon: T_LibraryIcon;
	iconClassName: T_IconProps["iconClassName"];
	size: T_IconProps["size"];
	color: T_IconProps["color"];
};

// TODO: [typescript]
// type T_LibraryIconProps = Partial<Pick<T_IconProps, "iconClassName" | "size" | "color">> & {
// 	icon: T_LibraryIcon;
// };

function LibraryIcon({ icon, iconClassName, size, color }: T_LibraryIconProps) {
	// vars
	const IconComponent = icon.icon;
	const iconComponentProps = {
		className: classNames(
			"tw-inline-block",
			icon.defaultProps.className,
			iconClassName,
			getSizeStyles(),
			getColorStyles(),
		),
		style: v.isNumber(size) ? { width: size, height: size } : {},
	};

	// utils
	function getColorStyles(): string {
		if (v.isNotEmptyString(color)) {
			return color;
		}

		if (v.isNotEmptyString(icon.defaultProps.color)) {
			return icon.defaultProps.color;
		}

		return "";
	}

	function getSizeStyles(): string {
		if (v.isUndefined(size)) {
			return "tw-w-4 tw-h-4";
		}

		if (v.isString(size)) {
			return size;
		}

		return "";
	}

	return <IconComponent {...iconComponentProps} />;
}

type T_ImageIconProps = {
	icon: T_ImageIcon;
	iconName: T_IconProps["icon"];
	iconClassName: T_IconProps["iconClassName"];
	size: T_IconProps["size"];
	withBackgroundWhenDarkMode: T_IconProps["withBackgroundWhenDarkMode"];
};

// TODO: [typescript]
// type T_ImageIconProps = Partial<
// 	Pick<T_IconProps, "iconClassName" | "size" | "withBackgroundWhenDarkMode">
// > & {
// 	icon: T_ImageIcon;
// 	iconName: T_IconProps["icon"];
// };

function ImageIcon({
	icon,
	iconName,
	iconClassName,
	size,
	withBackgroundWhenDarkMode,
}: T_ImageIconProps) {
	if (v.isString(size)) {
		throw new Error(`Size value for "${iconName}" icon has to be a number, not a string`);
	}

	// vars
	const iconComponentProps = {
		src: icon.icon,
		className: classNames(
			"tw-inline-block",
			icon.defaultProps.className,
			iconClassName,
			withBackgroundWhenDarkMode && "dark:tw-p-0.5",
		),
		width: v.isNumber(size) ? size : 24,
		height: v.isNumber(size) ? size : 24,
	};

	return (
		<Image
			{...iconComponentProps}
			alt={`${icon.defaultProps.alt} icon`}
		/>
	);
}
