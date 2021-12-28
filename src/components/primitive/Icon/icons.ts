import {
  ArrowUpIcon,
  BookOpenIcon,
  CalendarIcon,
  ChevronDoubleDownIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ClockIcon,
  CodeIcon,
  DotsCircleHorizontalIcon,
  ExternalLinkIcon,
  FilmIcon,
  LinkIcon,
  MenuIcon,
  MusicNoteIcon,
  PauseIcon,
  PencilAltIcon,
  PlayIcon,
  PresentationChartLineIcon,
  ReplyIcon,
  UserCircleIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@heroicons/react/outline";
import {
  CheckIcon,
  CogIcon,
  DotsCircleHorizontalIcon as DotsCircleHorizontalIconSolid,
  HeartIcon,
  MinusIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
} from "@heroicons/react/solid";

import type { E_Icons, T_ReactFunctionComponent } from "~/types";

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
  COUCHSURFING: {
    isLibraryIcon: false,
    icon: "/static/images/icons/couchsurfing.png",
    props: {
      className: "",
      alt: "Couchsurfing",
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
  GITHUB_LIGHT: {
    isLibraryIcon: false,
    icon: "/static/images/icons/github-light.svg",
    props: {
      className: "",
      alt: "GitHub light",
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
  GUITAR: {
    isLibraryIcon: false,
    icon: "/static/images/icons/guitar.svg",
    props: {
      className: "",
      alt: "Guitar",
    },
  },
  FLOWER_1: {
    isLibraryIcon: false,
    icon: "/static/images/icons/flower-1.svg",
    props: {
      className: "",
      alt: "Flower 1",
    },
  },
  FLOWER_2: {
    isLibraryIcon: false,
    icon: "/static/images/icons/flower-2.svg",
    props: {
      className: "",
      alt: "Flower 1",
    },
  },
  FLOWER_3: {
    isLibraryIcon: false,
    icon: "/static/images/icons/flower-3.svg",
    props: {
      className: "",
      alt: "Flower 1",
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
  LINKEDIN: {
    isLibraryIcon: false,
    icon: "/static/images/icons/linkedin.svg",
    props: {
      className: "",
      alt: "Linkedin",
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
  SOCCER: {
    isLibraryIcon: false,
    icon: "/static/images/icons/soccer.svg",
    props: {
      className: "",
      alt: "Soccer",
    },
  },
  TWITTER: {
    isLibraryIcon: false,
    icon: "/static/images/icons/twitter.svg",
    props: {
      className: "",
      alt: "Twitter",
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

  PRESENTATION_CHART_LINE: {
    isLibraryIcon: true,
    icon: PresentationChartLineIcon,
    props: {
      className: "",
    },
  },
  USER_CIRCLE: {
    isLibraryIcon: true,
    icon: UserCircleIcon,
    props: {
      className: "",
    },
  },
  CLIPBOARD: {
    isLibraryIcon: true,
    icon: ClipboardIcon,
    props: {
      className: "",
      color: "tw-text-yellow-700",
    },
  },
  FILM: {
    isLibraryIcon: true,
    icon: FilmIcon,
    props: {
      className: "",
    },
  },
  MUSIC_NOTE: {
    isLibraryIcon: true,
    icon: MusicNoteIcon,
    props: {
      className: "",
    },
  },
  BOOK_OPEN: {
    isLibraryIcon: true,
    icon: BookOpenIcon,
    props: {
      className: "",
    },
  },
  ARROW_UP: {
    isLibraryIcon: true,
    icon: ArrowUpIcon,
    props: {
      className: "",
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
  CHEVRON_DOWN: {
    isLibraryIcon: true,
    icon: ChevronDownIcon,
    props: {
      className: "",
      color: "",
    },
  },
  CHEVRON_DOUBLE_DOWN: {
    isLibraryIcon: true,
    icon: ChevronDoubleDownIcon,
    props: {
      className: "",
      color: "",
    },
  },
  CLOCK: {
    isLibraryIcon: true,
    icon: ClockIcon,
    props: {
      className: "",
      color: "",
    },
  },
  COG: {
    isLibraryIcon: true,
    icon: CogIcon,
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
  EXTERNAL_LINK: {
    isLibraryIcon: true,
    icon: ExternalLinkIcon,
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
  PLAY: {
    isLibraryIcon: true,
    icon: PlayIcon,
    props: {
      className: "",
      color: "",
    },
  },
  PAUSE: {
    isLibraryIcon: true,
    icon: PauseIcon,
    props: {
      className: "",
      color: "",
    },
  },
  REPLY: {
    isLibraryIcon: true,
    icon: ReplyIcon,
    props: {
      className: "",
      color: "",
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
      color: "",
    },
  },
  CODE: {
    isLibraryIcon: true,
    icon: CodeIcon,
    props: {
      className: "",
    },
  },
  MOON: {
    isLibraryIcon: true,
    icon: MoonIcon,
    props: {
      color: "",
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
