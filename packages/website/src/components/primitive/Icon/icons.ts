import {
  CalendarIcon,
  CodeIcon,
  LinkIcon,
  PencilAltIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@heroicons/react/outline";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

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

export default ICONS;
