import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  LinkIcon,
  MenuIcon,
  PencilAltIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
  DotsCircleHorizontalIcon,
} from "@heroicons/react/outline";
import {
  MoonIcon,
  SunIcon,
  HeartIcon,
  StarIcon,
  CheckIcon,
  MinusIcon,
  DotsCircleHorizontalIcon as DotsCircleHorizontalIconSolid,
} from "@heroicons/react/solid";

import { E_Icons, T_ReactFunctionComponent } from "~/types";

export type T_Icon = {
  isLibraryIcon: boolean;
  icon: string | T_ReactFunctionComponent;
  props: {
    className?: string;
    alt?: string;
    color?: string;
  };
};

export const ICONS: Record<E_Icons, T_Icon> = {
  "500PX": {
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
      alt: "GitHub",
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
  INSTAGRAM: {
    isLibraryIcon: false,
    icon: "/static/images/icons/instagram.svg",
    props: {
      className: "",
      alt: "Instagram",
    },
  },
  NETFLIX: {
    isLibraryIcon: false,
    icon: "/static/images/icons/netflix.svg",
    props: {
      className: "tw-rounded-full",
      alt: "Netflix",
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

  CALENDAR: {
    isLibraryIcon: true,
    icon: CalendarIcon,
    props: {
      className: "",
    },
  },
  CHECK: {
    isLibraryIcon: true,
    icon: CheckIcon,
    props: {
      className: "",
      color: "tw-text-green-500",
    },
  },
  CHEVRON_LEFT: {
    isLibraryIcon: true,
    icon: ChevronLeftIcon,
    props: {
      className: "",
      color: "",
    },
  },
  CHEVRON_RIGHT: {
    isLibraryIcon: true,
    icon: ChevronRightIcon,
    props: {
      className: "",
      color: "",
    },
  },
  DOTS_CIRCLE_HORIZONTAL: {
    isLibraryIcon: true,
    icon: DotsCircleHorizontalIcon,
    props: {
      className: "",
      color: "",
    },
  },
  DOTS_CIRCLE_HORIZONTAL_SOLID: {
    isLibraryIcon: true,
    icon: DotsCircleHorizontalIconSolid,
    props: {
      className: "",
      color: "",
    },
  },
  EDIT: {
    isLibraryIcon: true,
    icon: PencilAltIcon,
    props: {
      className: "",
    },
  },
  HEART: {
    isLibraryIcon: true,
    icon: HeartIcon,
    props: {
      className: "",
      color: "tw-text-red-500",
    },
  },
  LINK: {
    isLibraryIcon: true,
    icon: LinkIcon,
    props: {
      className: "",
    },
  },
  MENU: {
    isLibraryIcon: true,
    icon: MenuIcon,
    props: {
      className: "",
    },
  },
  MINUS: {
    isLibraryIcon: true,
    icon: MinusIcon,
    props: {
      className: "",
      color: "tw-text-white dark:tw-text-black",
    },
  },
  CODE: {
    isLibraryIcon: true,
    icon: CodeIcon,
    props: {
      className: "",
    },
  },
  STAR: {
    isLibraryIcon: true,
    icon: StarIcon,
    props: {
      className: "",
      color: "tw-text-yellow-500",
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