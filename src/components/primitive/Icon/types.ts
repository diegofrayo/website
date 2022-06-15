import type { T_ReactElement } from "~/types";

export const ICONS_KEYS = [
  // own
  "COUCHSURFING",
  "FLOWER_1",
  "FLOWER_2",
  "FLOWER_3",
  "GITHUB",
  "GITHUB_LIGHT",
  "GMAIL",
  "GUITAR",
  "INSTAGRAM",
  "LINKEDIN",
  "NETFLIX",
  "SOCCER",
  "SPOTIFY",
  "TWITTER",
  "WHATSAPP",
  "YOUTUBE",

  // library
  "ARROW_UP",
  "BOOK_OPEN",
  "CALENDAR",
  "CHAT",
  "CHECK",
  "CHEVRON_DOUBLE_DOWN",
  "CHEVRON_DOUBLE_UP",
  "CHEVRON_DOWN",
  "CHEVRON_LEFT",
  "CHEVRON_RIGHT",
  "CLIPBOARD",
  "CLOCK",
  "CODE",
  "COG",
  "COLOR_SWATCH",
  "DOTS_CIRCLE_HORIZONTAL",
  "DOTS_CIRCLE_HORIZONTAL_SOLID",
  "EDIT",
  "EXTERNAL_LINK",
  "FILM",
  "GLOBE_ALT",
  "HEART",
  "KEY",
  "LINK",
  "MENU",
  "MINUS",
  "MOON",
  "MUSIC_NOTE",
  "PAUSE",
  "PHONE",
  "PHOTOGRAPH",
  "PLAY",
  "PRESENTATION_CHART_LINE",
  "PRINTER",
  "REFRESH",
  "REPLY",
  "SERVER",
  "STAR",
  "SUN",
  "USER_CIRCLE",
  "VOLUME_OFF",
  "VOLUME_UP",
  "X",
  "ZOOM_IN",
  "ZOOM_OUT",
] as const;

export type T_IconName = typeof ICONS_KEYS[number];

export type T_Icon = {
  icon: T_IconComponent;
  defaultProps: {
    className?: string;
    alt?: string;
    color?: string;
  };
};

export type T_IconComponent = string | T_LibraryIconComponent;

export type T_LibraryIconComponent = (props: React.ComponentProps<"svg">) => T_ReactElement;
