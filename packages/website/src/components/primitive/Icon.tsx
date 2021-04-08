import React from "react";
import classnames from "classnames";
import {
  CalendarIcon,
  CodeIcon,
  LinkIcon,
  PencilAltIcon,
  ZoomInIcon,
  ZoomOutIcon,
  XIcon,
} from "@heroicons/react/outline";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

import Image from "./Image";

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
  YOUTUBE_DARK: "YOUTUBE_DARK",

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

const ICONS = {
  "500_PX": {
    isLibraryIcon: false,
    icon: "/static/images/icons/500px.svg",
    props: {
      className: "",
      alt: "500px",
    },
  },
  GITHUB: {
    isLibraryIcon: false,
    icon: "/static/images/icons/github.svg",
    props: {
      className: "",
      alt: "Github",
    },
  },
  GMAIL: {
    isLibraryIcon: false,
    icon: "/static/images/icons/gmail.svg",
    props: {
      className: "",
      alt: "Email",
    },
  },
  SPOTIFY: {
    isLibraryIcon: false,
    icon: "/static/images/icons/spotify.svg",
    props: {
      className: "",
      alt: "Spotify",
    },
  },
  WHATSAPP: {
    isLibraryIcon: false,
    icon: "/static/images/icons/whatsapp.svg",
    props: {
      className: "",
      alt: "WhatsApp",
    },
  },
  YOUTUBE: {
    isLibraryIcon: false,
    icon: "/static/images/icons/youtube.svg",
    props: {
      className: "",
      alt: "YouTube",
    },
  },
  YOUTUBE_DARK: {
    isLibraryIcon: false,
    icon: "/static/images/icons/youtube-dark.svg",
    props: {
      className: "",
      alt: "YouTube dark",
    },
  },

  CALENDAR: {
    isLibraryIcon: true,
    icon: CalendarIcon,
    props: {
      className: "",
    },
  },
  EDIT: {
    isLibraryIcon: true,
    icon: PencilAltIcon,
    props: {
      className: "",
    },
  },
  LINK: {
    isLibraryIcon: true,
    icon: LinkIcon,
    props: {
      className: "",
    },
  },
  CODE: {
    isLibraryIcon: true,
    icon: CodeIcon,
    props: {
      className: "",
    },
  },
  SUN: {
    isLibraryIcon: true,
    icon: SunIcon,
    props: {
      color: "tw-text-yellow-600",
    },
  },
  MOON: {
    isLibraryIcon: true,
    icon: MoonIcon,
    props: {
      color: "tw-text-purple-600",
    },
  },
  ZOOM_IN: {
    isLibraryIcon: true,
    icon: ZoomInIcon,
    props: {
      className: "",
    },
  },
  ZOOM_OUT: {
    isLibraryIcon: true,
    icon: ZoomOutIcon,
    props: {
      className: "",
    },
  },
  X: {
    isLibraryIcon: true,
    icon: XIcon,
    props: {
      className: "",
    },
  },
};

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
    className: classnames(
      withDarkModeBackground &&
        !icon.isLibraryIcon &&
        "dark:tw-p-1 dark:dfr-bg-secondary dark:tw-rounded-md tw-overflow-hidden",
      wrapperClassName,
    ),
  };
  const IconComponent = icon.isLibraryIcon ? icon.icon : Image;
  const iconComponentProps = icon.isLibraryIcon
    ? {
        className: classnames(
          icon.props.color || "tw-text-black",
          !icon.props.color && !withDarkModeBackground && "dark:tw-text-white",
          "tw-inline-block",
          size === undefined && "tw-w-4 tw-h-4",
          typeof size === "string" && size,
          icon.props.className,
          iconClassName,
        ),
        ...(typeof size === "number" && { style: { width: size, height: size } }),
      }
    : {
        src: icon.icon,
        alt: `${icon.props.alt} icon`,
        className: classnames(
          "tw-inline-block",
          size === undefined && "tw-w-4 tw-h-4",
          typeof size === "string" && size,
          icon.props.className,
          iconClassName,
        ),
        ...(typeof size === "number" && { style: { width: size, height: size } }),
      };

  return { wrapperProps, IconComponent, iconComponentProps };
}

// --- Components ---

function Wrapper({ children, className }: { children: JSX.Element; className?: string }) {
  return (
    <span className={classnames("tw-inline-flex tw-items-center tw-justify-center", className)}>
      {children}
    </span>
  );
}
