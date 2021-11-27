import * as React from "react";
import classNames from "classnames";

import {
  E_Icons,
  T_HTMLElementAttributes,
  T_ReactElement,
  T_ReactFunctionComponent,
} from "~/types";

import Image from "../Image";
import Block from "../Block";
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
  IconComponent: T_ReactFunctionComponent<T_HTMLElementAttributes["img"]> | undefined;
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

    return "dfr-text-color-dark-strong dark:dfr-text-color-light-strong";
  }

  const wrapperProps = {
    className: classNames(
      "dfr-Icon",
      withDarkModeBackground &&
        "dark:dfr-bg-color-light-strong dark:tw-rounded-full tw-overflow-hidden",
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

function Wrapper({ children, className = "" }: T_HTMLElementAttributes["span"]) {
  return (
    <Block className={classNames("tw-inline-flex tw-align-middle", className)} align="CENTER">
      {children}
    </Block>
  );
}
