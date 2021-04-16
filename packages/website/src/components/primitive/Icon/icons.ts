import {
  CalendarIcon,
  CodeIcon,
  LinkIcon,
  PencilAltIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@heroicons/react/outline";
import { MoonIcon, SunIcon, HeartIcon, StarIcon, CheckIcon } from "@heroicons/react/solid";

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
      color: "tw-text-green-700",
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
      color: "tw-text-red-700",
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
  STAR: {
    isLibraryIcon: true,
    icon: StarIcon,
    props: {
      className: "",
      color: "tw-text-yellow-400",
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
