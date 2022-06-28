import {
	ArrowUpIcon,
	BookOpenIcon,
	CalendarIcon,
	ChatIcon,
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ClipboardIcon,
	ClockIcon,
	CodeIcon,
	ColorSwatchIcon,
	DotsCircleHorizontalIcon,
	ExternalLinkIcon,
	FilmIcon,
	GlobeAltIcon,
	KeyIcon,
	LinkIcon,
	MenuIcon,
	MusicNoteIcon,
	PauseIcon,
	PencilAltIcon,
	PhoneIcon,
	PhotographIcon,
	PlayIcon,
	PresentationChartLineIcon,
	PrinterIcon,
	RefreshIcon,
	ReplyIcon,
	ServerIcon,
	UserCircleIcon,
	VolumeOffIcon,
	VolumeUpIcon,
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
import { T_ReactElement } from "~/types";

export const ICONS = {
	// own
	COUCHSURFING: {
		icon: "/static/images/icons/couchsurfing.png",
		defaultProps: {
			className: "",
			alt: "Couchsurfing",
		},
	},
	GITHUB: {
		icon: "/static/images/icons/github.svg",
		defaultProps: {
			className: "",
			alt: "GitHub",
		},
	},
	GITHUB_LIGHT: {
		icon: "/static/images/icons/github-light.svg",
		defaultProps: {
			className: "",
			alt: "GitHub light",
		},
	},
	GMAIL: {
		icon: "/static/images/icons/gmail.svg",
		defaultProps: {
			className: "",
			alt: "Email",
		},
	},
	GUITAR: {
		icon: "/static/images/icons/guitar.svg",
		defaultProps: {
			className: "",
			alt: "Guitar",
		},
	},
	FLOWER_1: {
		icon: "/static/images/icons/flower-1.svg",
		defaultProps: {
			className: "",
			alt: "Flower 1",
		},
	},
	FLOWER_2: {
		icon: "/static/images/icons/flower-2.svg",
		defaultProps: {
			className: "",
			alt: "Flower 1",
		},
	},
	FLOWER_3: {
		icon: "/static/images/icons/flower-3.svg",
		defaultProps: {
			className: "",
			alt: "Flower 1",
		},
	},
	INSTAGRAM: {
		icon: "/static/images/icons/instagram.svg",
		defaultProps: {
			className: "",
			alt: "Instagram",
		},
	},
	LINKEDIN: {
		icon: "/static/images/icons/linkedin.svg",
		defaultProps: {
			className: "",
			alt: "Linkedin",
		},
	},
	NETFLIX: {
		icon: "/static/images/icons/netflix.svg",
		defaultProps: {
			className: "tw-rounded-full",
			alt: "Netflix",
		},
	},
	SPOTIFY: {
		icon: "/static/images/icons/spotify.svg",
		defaultProps: {
			className: "",
			alt: "Spotify",
		},
	},
	SOCCER: {
		icon: "/static/images/icons/soccer.svg",
		defaultProps: {
			className: "",
			alt: "Soccer",
		},
	},
	TWITTER: {
		icon: "/static/images/icons/twitter.svg",
		defaultProps: {
			className: "",
			alt: "Twitter",
		},
	},
	WHATSAPP: {
		icon: "/static/images/icons/whatsapp.svg",
		defaultProps: {
			className: "",
			alt: "WhatsApp",
		},
	},
	YOUTUBE: {
		icon: "/static/images/icons/youtube.svg",
		defaultProps: {
			className: "",
			alt: "YouTube",
		},
	},

	// library icons
	ARROW_UP: {
		icon: ArrowUpIcon,
		defaultProps: {
			className: "",
		},
	},
	BOOK_OPEN: {
		icon: BookOpenIcon,
		defaultProps: {
			className: "",
		},
	},
	CALENDAR: {
		icon: CalendarIcon,
		defaultProps: {
			className: "",
		},
	},
	CHAT: {
		icon: ChatIcon,
		defaultProps: {
			className: "",
		},
	},
	CHECK: {
		icon: CheckIcon,
		defaultProps: {
			className: "",
			color: "tw-text-green-500",
		},
	},
	CHEVRON_DOWN: {
		icon: ChevronDownIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CHEVRON_DOUBLE_DOWN: {
		icon: ChevronDoubleDownIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CHEVRON_DOUBLE_UP: {
		icon: ChevronDoubleUpIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CHEVRON_LEFT: {
		icon: ChevronLeftIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CHEVRON_RIGHT: {
		icon: ChevronRightIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CLIPBOARD: {
		icon: ClipboardIcon,
		defaultProps: {
			className: "",
			color: "tw-text-yellow-700",
		},
	},
	CLOCK: {
		icon: ClockIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CODE: {
		icon: CodeIcon,
		defaultProps: {
			className: "",
		},
	},
	COG: {
		icon: CogIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	COLOR_SWATCH: {
		icon: ColorSwatchIcon,
		defaultProps: {
			className: "",
		},
	},
	DOTS_CIRCLE_HORIZONTAL: {
		icon: DotsCircleHorizontalIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	DOTS_CIRCLE_HORIZONTAL_SOLID: {
		icon: DotsCircleHorizontalIconSolid,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	EDIT: {
		icon: PencilAltIcon,
		defaultProps: {
			className: "",
		},
	},
	EXTERNAL_LINK: {
		icon: ExternalLinkIcon,
		defaultProps: {
			className: "",
		},
	},
	FILM: {
		icon: FilmIcon,
		defaultProps: {
			className: "",
		},
	},
	GLOBE_ALT: {
		icon: GlobeAltIcon,
		defaultProps: {
			className: "",
		},
	},
	HEART: {
		icon: HeartIcon,
		defaultProps: {
			className: "",
			color: "tw-text-red-500",
		},
	},
	KEY: {
		icon: KeyIcon,
		defaultProps: {
			className: "",
		},
	},
	LINK: {
		icon: LinkIcon,
		defaultProps: {
			className: "",
		},
	},
	MENU: {
		icon: MenuIcon,
		defaultProps: {
			className: "",
		},
	},
	MINUS: {
		icon: MinusIcon,
		defaultProps: {
			className: "",
			color: "tw-text-white dark:tw-text-black",
		},
	},
	MOON: {
		icon: MoonIcon,
		defaultProps: {
			color: "",
		},
	},
	MUSIC_NOTE: {
		icon: MusicNoteIcon,
		defaultProps: {
			className: "",
		},
	},
	PAUSE: {
		icon: PauseIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	PLAY: {
		icon: PlayIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	PHONE: {
		icon: PhoneIcon,
		defaultProps: {
			className: "",
		},
	},
	PHOTOGRAPH: {
		icon: PhotographIcon,
		defaultProps: {
			className: "",
		},
	},
	PRESENTATION_CHART_LINE: {
		icon: PresentationChartLineIcon,
		defaultProps: {
			className: "",
		},
	},
	PRINTER: {
		icon: PrinterIcon,
		defaultProps: {
			className: "",
		},
	},
	REFRESH: {
		icon: RefreshIcon,
		defaultProps: {
			className: "",
		},
	},
	REPLY: {
		icon: ReplyIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	SERVER: {
		icon: ServerIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	STAR: {
		icon: StarIcon,
		defaultProps: {
			className: "",
			color: "tw-text-yellow-500",
		},
	},
	SUN: {
		icon: SunIcon,
		defaultProps: {
			color: "",
		},
	},
	USER_CIRCLE: {
		icon: UserCircleIcon,
		defaultProps: {
			className: "",
		},
	},
	VOLUME_OFF: {
		icon: VolumeOffIcon,
		defaultProps: {
			className: "",
		},
	},
	VOLUME_UP: {
		icon: VolumeUpIcon,
		defaultProps: {
			className: "",
		},
	},
	X: {
		icon: XIcon,
		defaultProps: {
			className: "",
		},
	},
	ZOOM_IN: {
		icon: ZoomInIcon,
		defaultProps: {
			className: "",
		},
	},
	ZOOM_OUT: {
		icon: ZoomOutIcon,
		defaultProps: {
			className: "",
		},
	},
} as const;

// --- Types ---

export type T_Icon = {
	icon: string | T_LibraryIconComponent;
	defaultProps: {
		className?: string;
		alt?: string;
		color?: string;
	};
};

export type T_LibraryIconComponent = (props: React.ComponentProps<"svg">) => T_ReactElement;

export type T_IconName = keyof typeof ICONS;
