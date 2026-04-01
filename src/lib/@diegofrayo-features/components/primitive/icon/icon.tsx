import type { ComponentProps } from "react";

import cn from "@diegofrayo-pkg/cn";
import type UtilsTypes from "@diegofrayo-pkg/types";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { getObjectKeys, mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";
import { isNotEmptyString, isNumber, isString, isUndefined } from "@diegofrayo-pkg/validator";

import Box from "../box";
import Image from "../image";
import Icons from "./icons";

// --- PROPS & TYPES ---

export type IconName = keyof typeof Icons;

interface LibraryIcon {
	icon: LibraryIconComponent;
	defaultProps: {
		className?: string;
		color?: string;
		size?: number;
	};
}

interface CustomIcon {
	icon: string;
	defaultProps: {
		alt: string;
		className?: string;
		color?: string;
		size?: number;
	};
}

type Icon = LibraryIcon | CustomIcon;

type LibraryIconComponent = (props: ComponentProps<"svg">) => ReactTypes.JSXElement;

export type IconProps = ComponentProps<"svg"> & {
	icon: IconName;
	size?: number | string; // number: for width and height attrs | string: for className attr
	color?: string;
	iconClassName?: string;
	wrapperClassName?: string;
	wrapperProps?: UtilsTypes.Object;
};

// --- COMPONENT DEFINITION ---

function Icon({
	icon: iconName,
	size = undefined,
	color = undefined,
	iconClassName = "",
	wrapperClassName = "",
	wrapperProps: wrapperPropsProp = {},
	...svgProps
}: IconProps) {
	// --- COMPUTED STATES ---
	const icon = Icons[iconName] as Icon;
	const wrapperProps = {
		className: cn("dr-icon", wrapperClassName),
		...wrapperPropsProp,
	};

	// --- UTILS ---
	function getLibraryIconColorStyles() {
		if (isNotEmptyString(color)) {
			return color;
		}

		if (isNotEmptyString(icon.defaultProps.color)) {
			return icon.defaultProps.color;
		}

		return "";
	}

	function getIconSizeStyles(defaultSize: number) {
		if (isNumber(size)) {
			return { width: size, height: size };
		}

		if (isNumber(icon.defaultProps.size)) {
			return { width: icon.defaultProps.size, height: icon.defaultProps.size };
		}

		return { width: defaultSize, height: defaultSize };
	}

	if (isUndefined(icon)) {
		console.warn("Icon does not exist", iconName);
		return null;
	}

	const iconBaseStyles = cn(
		"inline-block",
		icon.defaultProps.className,
		iconClassName,
		isString(size) && size,
	);

	if (isLibraryIcon(icon)) {
		const iconComponentProps = {
			className: cn(
				svgProps.className,
				iconBaseStyles,
				getLibraryIconColorStyles(),
				`icon--${generateSlug(iconName)}`,
			),
			...getIconSizeStyles(16),
		};
		const IconComponent = icon.icon;

		return (
			<Wrapper {...wrapperProps}>
				<IconComponent
					{...iconComponentProps}
					{...svgProps}
					className={iconComponentProps.className}
				/>
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

	console.warn("Invalid props combinations", {
		icon,
		size,
		color,
		iconClassName,
		wrapperClassName,
	});

	return null;
}

export default Icon;

export const IconCatalog = mirror(getObjectKeys(Icons));

// --- COMPONENTS ---

function Wrapper({ children, className = "" }: ReactTypes.DOM.HTMLElementAttributes["span"]) {
	return (
		<Box
			as="span"
			className={cn("inline-flex items-center justify-center align-middle", className)}
		>
			{children}
		</Box>
	);
}

// --- UTILS ---

function isLibraryIcon(iconConfig: Icon): iconConfig is LibraryIcon {
	return !isString(iconConfig.icon);
}

function isCustomIcon(iconConfig: Icon): iconConfig is CustomIcon {
	return isLibraryIcon(iconConfig) === false;
}
