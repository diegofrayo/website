import {
	ArchiveBoxIcon,
	ArrowDownTrayIcon,
	ArrowPathIcon,
	ArrowTopRightOnSquareIcon,
	ArrowUpIcon,
	ArrowUturnRightIcon,
	Bars4Icon,
	BookOpenIcon,
	CalendarIcon,
	ChatBubbleLeftEllipsisIcon,
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ClipboardIcon,
	ClockIcon,
	CodeBracketIcon,
	DocumentTextIcon,
	EllipsisHorizontalCircleIcon,
	FilmIcon,
	GlobeAltIcon,
	HeartIcon,
	KeyIcon,
	LinkIcon,
	LockClosedIcon,
	LockOpenIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	MusicalNoteIcon,
	PauseIcon,
	PencilSquareIcon,
	PhoneIcon,
	PhotoIcon,
	PlayIcon,
	PresentationChartLineIcon,
	PrinterIcon,
	ServerIcon,
	SpeakerWaveIcon,
	SpeakerXMarkIcon,
	UserCircleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	ChatBubbleLeftEllipsisIcon as ChatBubbleLeftEllipsisIconSolid,
	CheckIcon,
	CogIcon,
	EllipsisHorizontalCircleIcon as EllipsisHorizontalCircleIconSolid,
	HeartIcon as HeartIconSolid,
	MinusIcon,
	MoonIcon,
	PhoneIcon as PhoneIconSolid,
	StarIcon,
	SunIcon,
} from "@heroicons/react/24/solid";
import { T_ReactElement } from "~/types";

export const ICONS = {
	// own
	COUCHSURFING: {
		icon: "/static/images/icons/couchsurfing.png",
		defaultProps: {
			className: "tw-rounded-full",
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
	ARCHIVE_BOX: {
		icon: ArchiveBoxIcon,
		defaultProps: {
			className: "",
		},
	},
	ARROW_DOWN_TRAY: {
		icon: ArrowDownTrayIcon,
		defaultProps: {
			className: "",
		},
	},
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
		icon: ChatBubbleLeftEllipsisIcon,
		defaultProps: {
			className: "",
		},
	},
	CHAT_SOLID: {
		icon: ChatBubbleLeftEllipsisIconSolid,
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
		icon: CodeBracketIcon,
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
	DOCUMENT_TEXT: {
		icon: DocumentTextIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	DOTS_CIRCLE_HORIZONTAL: {
		icon: EllipsisHorizontalCircleIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	DOTS_CIRCLE_HORIZONTAL_SOLID: {
		icon: EllipsisHorizontalCircleIconSolid,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	EDIT: {
		icon: PencilSquareIcon,
		defaultProps: {
			className: "",
		},
	},
	EXTERNAL_LINK: {
		icon: ArrowTopRightOnSquareIcon,
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
	HEART_SOLID: {
		icon: HeartIconSolid,
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
	LOCK_CLOSED: {
		icon: LockClosedIcon,
		defaultProps: {
			className: "",
		},
	},
	LOCK_OPEN: {
		icon: LockOpenIcon,
		defaultProps: {
			className: "",
		},
	},
	MENU: {
		icon: Bars4Icon,
		defaultProps: {
			className: "",
		},
	},
	MINUS: {
		icon: MinusIcon,
		defaultProps: {
			className: "",
			color: "dfr-text-color-gs-white dark:dfr-text-color-gs-black",
		},
	},
	MOON: {
		icon: MoonIcon,
		defaultProps: {
			color: "",
		},
	},
	MUSIC_NOTE: {
		icon: MusicalNoteIcon,
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
	PHONE_SOLID: {
		icon: PhoneIconSolid,
		defaultProps: {
			className: "",
		},
	},
	PHOTO: {
		icon: PhotoIcon,
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
		icon: ArrowPathIcon,
		defaultProps: {
			className: "",
		},
	},
	REPLY: {
		icon: ArrowUturnRightIcon,
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
		icon: SpeakerXMarkIcon,
		defaultProps: {
			className: "",
		},
	},
	VOLUME_UP: {
		icon: SpeakerWaveIcon,
		defaultProps: {
			className: "",
		},
	},
	X: {
		icon: XMarkIcon,
		defaultProps: {
			className: "",
		},
	},
	ZOOM_IN: {
		icon: MagnifyingGlassPlusIcon,
		defaultProps: {
			className: "",
		},
	},
	ZOOM_OUT: {
		icon: MagnifyingGlassMinusIcon,
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
