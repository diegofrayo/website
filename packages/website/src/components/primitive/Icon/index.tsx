import React from "react";
import classNames from "classnames";

import Image from "../Image";
import ICONS from "./icons";

// TODO: Color prop
type IconProps = {
  icon: string;
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

Icon.icon = {
  "500_PX": "500_PX",
  GITHUB: "GITHUB",
  GMAIL: "GMAIL",
  SPOTIFY: "SPOTIFY",
  WHATSAPP: "WHATSAPP",
  YOUTUBE: "YOUTUBE",

  CALENDAR: "CALENDAR",
  CODE: "CODE",
  EDIT: "EDIT",
  LINK: "LINK",
  MOON: "MOON",
  SUN: "SUN",
  X: "X",
  ZOOM_IN: "ZOOM_IN",
  ZOOM_OUT: "ZOOM_OUT",
};

export default Icon;

// --- Controller ---

function useController({
  icon: iconName,
  size = undefined,
  iconClassName = "",
  wrapperClassName = "",
  withDarkModeBackground = false,
}: IconProps) {
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
        src: icon.icon,
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

function Wrapper({ children, className }: { children: JSX.Element; className?: string }) {
  return (
    <span className={classNames("tw-inline-flex tw-items-center tw-justify-center", className)}>
      {children}
    </span>
  );
}
