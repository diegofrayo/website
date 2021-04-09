import React from "react";
import classNames from "classnames";

import { T_ReactChildrenProp, E_Icons } from "~/types";

import Image from "../Image";
import ICONS from "./icons";

type IconProps = {
  icon: E_Icons;
  size?: number | string; // number: width | string: className
  iconClassName?: string;
  wrapperClassName?: string;
  withDarkModeBackground?: boolean;
};

function Icon(props: IconProps) {
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
  iconClassName = "",
  wrapperClassName = "",
  withDarkModeBackground = false,
}: IconProps): {
  wrapperProps: { className: string } | undefined;
  IconComponent: any;
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

  const wrapperProps = {
    className: classNames(
      withDarkModeBackground &&
        !icon.isLibraryIcon &&
        "dark:dfr-bg-secondary dark:tw-rounded-full tw-overflow-hidden",
      wrapperClassName,
    ),
  };
  const IconComponent = icon.isLibraryIcon ? icon.icon : Image;
  const iconComponentProps = icon.isLibraryIcon
    ? {
        className: classNames(
          "tw-inline-block",
          size === undefined && "tw-w-4 tw-h-4",
          typeof size === "string" && size,
          icon.props.className,
          iconClassName,

          icon.props.color || "tw-text-black",
          !icon.props.color && "dark:tw-text-white",
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

function Wrapper({
  children,
  className = "",
}: {
  children: T_ReactChildrenProp;
  className?: string;
}) {
  return (
    <span className={classNames("tw-inline-flex tw-items-center tw-justify-center", className)}>
      {children}
    </span>
  );
}
