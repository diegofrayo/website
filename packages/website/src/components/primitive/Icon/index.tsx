import React from "react";
import classNames from "classnames";

import { E_Icons, T_HTML_Attributes, T_ReactElement, T_ReactFunctionComponent } from "~/types";

import Image from "../Image";
import { ICONS, T_Icon } from "./icons";

type IconProps = {
  icon: E_Icons;
  size?: number | string; // number: width | string: className
  color?: string;
  iconClassName?: string;
  wrapperClassName?: string;
  withDarkModeBackground?: boolean;
};

function Icon(props: IconProps): T_ReactElement {
  const { wrapperProps, IconComponent, iconComponentProps } = useController(props);

  if (!IconComponent) return null;

  return (
    <Wrapper {...wrapperProps}>
      <IconComponent {...iconComponentProps} />
    </Wrapper>
  );
}

Icon.icon = E_Icons;

export default Icon;

// --- Controller ---

function useController({
  icon: iconName,
  size = undefined,
  color = undefined,
  iconClassName = "",
  wrapperClassName = "",
  withDarkModeBackground = false,
}: IconProps): {
  wrapperProps: { className: string } | undefined;
  IconComponent: T_ReactFunctionComponent<T_HTML_Attributes["img"]> | undefined;
  iconComponentProps:
    | {
        src?: string;
        alt?: string;
        className: string;
        style?: { width: number; height: number };
      }
    | undefined;
} {
  const icon = ICONS[iconName];

  if (!icon) {
    console.warn(`Icon "${iconName}" not found.`);
    return {
      wrapperProps: undefined,
      IconComponent: undefined,
      iconComponentProps: undefined,
    };
  }

  function getColorStyles(icon: T_Icon, color?: string): string {
    if (color) {
      return color;
    }

    if (icon.props.color) {
      return icon.props.color;
    }

    return "tw-text-black dark:tw-text-white";
  }

  const wrapperProps = {
    className: classNames(
      "dfr-Icon",
      withDarkModeBackground && "dark:dfr-bg-secondary dark:tw-rounded-full tw-overflow-hidden",
      wrapperClassName,
    ),
  };
  const IconComponent = (icon.isLibraryIcon ? icon.icon : Image) as T_ReactFunctionComponent;
  const iconComponentProps = icon.isLibraryIcon
    ? {
        className: classNames(
          "tw-inline-block",
          size === undefined && "tw-w-4 tw-h-4",
          typeof size === "string" && size,
          icon.props.className,
          iconClassName,

          getColorStyles(icon, color),
        ),
        ...(typeof size === "number" && { style: { width: size, height: size } }),
      }
    : {
        src: icon.icon as string,
        alt: `${icon.props.alt} icon`,
        className: classNames(
          "tw-inline-block",
          size === undefined && "tw-w-4 tw-h-4",
          typeof size === "string" && size,
          icon.props.className,
          iconClassName,

          withDarkModeBackground && "dark:tw-p-0.5",
        ),
        ...(typeof size === "number" && { style: { width: size, height: size } }),
      };

  return { wrapperProps, IconComponent, iconComponentProps };
}

// --- Components ---

function Wrapper({ children, className = "" }: T_HTML_Attributes["span"]) {
  return (
    <span className={classNames("tw-inline-flex tw-items-center tw-justify-center", className)}>
      {children}
    </span>
  );
}
