import React from "react";
import classnames from "classnames";

import Image from "./Image";

function Icon(props) {
  const { src, className, alt, size, ...rest } = useController(props);

  if (!src) return null;

  return <Image src={src} className={className} alt={`${alt} icon`} width={size} {...rest} />;
}

Icon.variant = {
  DEFAULT: "DEFAULT",
  UNSTYLED: "UNSTYLED",
};

Icon.icon = {
  "500_PX": "500_PX",
  CALENDAR: "CALENDAR",
  EDIT: "EDIT",
  EMAIL: "EMAIL",
  GITHUB: "GITHUB",
  LINK: "LINK",
  MOON: "MOON",
  SOURCE_CODE: "SOURCE_CODE",
  SPOTIFY: "SPOTIFY",
  SUN: "SUN",
  WHATSAPP: "WHATSAPP",
  YOUTUBE: "YOUTUBE",
  YOUTUBE_DARK: "YOUTUBE_DARK",
  ZOOM_IN: "ZOOM_IN",
  ZOOM_OUT: "ZOOM_OUT",
};

export default Icon;

// --- Controller ---

const ICONS = {
  GITHUB: {
    src: "/static/images/icons/github.svg",
    className: "",
    alt: "Github",
  },
  EMAIL: {
    src: "/static/images/icons/email.svg",
    className: "",
    alt: "Email",
  },
  SPOTIFY: {
    src: "/static/images/icons/spotify.svg",
    className: "",
    alt: "Spotify",
  },
  "500_PX": {
    src: "/static/images/icons/500px.svg",
    className: "",
    alt: "500px",
  },
  SUN: {
    src: "/static/images/icons/sun.svg",
    className: "",
    alt: "Sun",
  },
  MOON: {
    src: "/static/images/icons/moon.svg",
    className: "",
    alt: "Moon",
  },
  CALENDAR: {
    src: "/static/images/icons/calendar.svg",
    className: "",
    alt: "Calendar",
  },
  EDIT: {
    src: "/static/images/icons/edit.svg",
    className: "",
    alt: "Edit",
  },
  LINK: {
    src: "/static/images/icons/link.svg",
    className: "tw-transform tw-rotate-45",
    alt: "Link",
  },
  SOURCE_CODE: {
    src: "/static/images/icons/source-code.svg",
    className: "",
    alt: "Source code",
  },
  YOUTUBE: {
    src: "/static/images/icons/youtube.svg",
    className: "",
    alt: "YouTube",
  },
  YOUTUBE_DARK: {
    src: "/static/images/icons/youtube-dark.svg",
    className: "",
    alt: "YouTube dark",
  },
  ZOOM_IN: {
    src: "/static/images/icons/zoom-in.svg",
    className: "",
    alt: "Zoom in",
  },
  ZOOM_OUT: {
    src: "/static/images/icons/zoom-out.svg",
    className: "",
    alt: "Zoom out",
  },
  WHATSAPP: {
    src: "/static/images/icons/whatsapp.svg",
    className: "",
    alt: "WhatsApp",
  },
};

function useController({ icon: iconName, className, variant = "DEFAULT", size, ...rest }) {
  const icon = ICONS[iconName];
  const isUrl = iconName.startsWith("/");

  if (isUrl) {
    return { ...rest, src: iconName, size, className };
  }

  if (!icon) {
    console.warn(`Icon "${icon}" not found.`);
    return {};
  }

  return {
    ...rest,
    ...icon,
    size,
    className: classnames(
      variant !== "UNSTYLED" &&
        "dark:tw-p-1 dark:dfr-bg-secondary dark:tw-rounded-md tw-overflow-hidden",
      !size && "tw-h-6 tw-w-6",
      !size && variant !== "UNSTYLED" && "dark:tw-h-8 dark:tw-w-8",
      icon.className,
      className,
    ),
  };
}
