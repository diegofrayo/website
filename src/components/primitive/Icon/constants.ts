import {
	ArrowDownTrayIcon,
	ArrowPathIcon,
	ArrowTopRightOnSquareIcon,
	ArrowUpIcon,
	Bars4Icon,
	CalendarIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ClipboardIcon,
	CodeBracketIcon,
	CogIcon,
	DocumentDuplicateIcon,
	DocumentTextIcon,
	EnvelopeIcon,
	ExclamationTriangleIcon,
	GlobeAltIcon,
	HomeIcon,
	LinkIcon,
	PauseIcon,
	PlayIcon,
	RssIcon,
	Square3Stack3DIcon,
	UserCircleIcon,
	WindowIcon,
	WrenchIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon as PlaySolidIcon } from "@heroicons/react/24/solid";
import {
	GithubMonoIcon,
	GmailMonoIcon,
	InstagramMonoIcon,
	LinkedinMonoIcon,
	SpotifyMonoIcon,
	TwitterMonoIcon,
} from "./social-icons";

const ICONS = {
	// --- OWN ICONS ---
	GITHUB: {
		icon: "/assets/images/icons/github.svg",
		defaultProps: {
			alt: "GitHub",
		},
	},
	GITHUB_MONO: {
		icon: GithubMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	GMAIL: {
		icon: "/assets/images/icons/gmail.svg",
		defaultProps: {
			alt: "Email",
		},
	},
	GMAIL_MONO: {
		icon: GmailMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	GUITAR: {
		icon: "/assets/images/icons/guitar.svg",
		defaultProps: {
			alt: "Guitar",
		},
	},
	INSTAGRAM: {
		icon: "/assets/images/icons/instagram.svg",
		defaultProps: {
			alt: "Instagram",
		},
	},
	INSTAGRAM_MONO: {
		icon: InstagramMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	LINKEDIN: {
		icon: "/assets/images/icons/linkedin.svg",
		defaultProps: {
			alt: "Linkedin",
		},
	},
	LINKEDIN_MONO: {
		icon: LinkedinMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	MAPS: {
		icon: "/assets/images/icons/maps.svg",
		defaultProps: {
			alt: "Google Maps",
		},
	},
	NETFLIX: {
		icon: "/assets/images/icons/netflix.svg",
		defaultProps: {
			className: "tw-rounded-full",
			alt: "Netflix",
		},
	},
	SOCCER: {
		icon: "/assets/images/icons/soccer.svg",
		defaultProps: {
			alt: "Soccer",
		},
	},
	SPOTIFY: {
		icon: "/assets/images/icons/spotify.svg",
		defaultProps: {
			alt: "Spotify",
		},
	},
	SPOTIFY_MONO: {
		icon: SpotifyMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	TWITTER: {
		icon: TwitterMonoIcon,
		defaultProps: {
			alt: "Twitter",
		},
	},
	WHATSAPP: {
		icon: "/assets/images/icons/whatsapp.svg",
		defaultProps: {
			alt: "WhatsApp",
		},
	},
	YOUTUBE: {
		icon: "/assets/images/icons/youtube.svg",
		defaultProps: {
			alt: "YouTube",
		},
	},

	// --- LIBRARY ICONS ---
	ARROW_DOWN_TRAY: {
		icon: ArrowDownTrayIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	ARROW_UP: {
		icon: ArrowUpIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CALENDAR: {
		icon: CalendarIcon,
		defaultProps: {
			className: "",
		},
	},
	CHEVRON_DOWN: {
		icon: ChevronDownIcon,
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
	CLIPBOARD: {
		icon: ClipboardIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CLOSE: {
		icon: XMarkIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	CODE: {
		icon: CodeBracketIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	COPY: {
		icon: DocumentDuplicateIcon,
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
	EXTERNAL_LINK: {
		icon: ArrowTopRightOnSquareIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	ENVELOPE: {
		icon: EnvelopeIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	GLOBE_ALT: {
		icon: GlobeAltIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	HOME: {
		icon: HomeIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	LINK: {
		icon: LinkIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	MENU: {
		icon: Bars4Icon,
		defaultProps: {
			className: "",
			color: "",
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
	PLAY_SOLID: {
		icon: PlaySolidIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	REFRESH: {
		icon: ArrowPathIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	RSS: {
		icon: RssIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	SETTINGS: {
		icon: CogIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	STACK: {
		icon: Square3Stack3DIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	TOOL: {
		icon: WrenchIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	USER_CIRCLE: {
		icon: UserCircleIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	WARNING: {
		icon: ExclamationTriangleIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	WINDOW: {
		icon: WindowIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
};

export default ICONS;

/*
import {
	ArchiveBoxIcon,
	ArrowDownTrayIcon,
	ArrowPathIcon,
	ArrowTopRightOnSquareIcon,
	ArrowUpIcon,
	ArrowUturnRightIcon,
	Bars4Icon,
	BookOpenIcon,
	BriefcaseIcon,
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
	CheckBadgeIcon as CheckBadgeIconSolid,
	CogIcon,
	EllipsisHorizontalCircleIcon as EllipsisHorizontalCircleIconSolid,
	HeartIcon as HeartIconSolid,
	MinusIcon,
	MoonIcon,
	PhoneIcon as PhoneIconSolid,
	StarIcon,
	SunIcon,
} from "@heroicons/react/24/solid";
import { DR.React.JSXElement } from "~/types";

export const ICONS = {


	// library icons
	ARCHIVE_BOX: {
		icon: ArchiveBoxIcon,
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
	BRIEFCASE: {
		icon: BriefcaseIcon,
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
	CHECK_BADGE: {
		icon: CheckBadgeIconSolid,
		defaultProps: {
			className: "",
			color: "",
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
			color: "",
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

// --- TYPES ---

export type T_Icon = {
	icon: string | T_LibraryIconComponent;
	defaultProps: {
		className?: string;
		alt?: string;
		color?: string;
	};
};

export type T_LibraryIconComponent = (props: React.ComponentProps<"svg">) => DR.React.JSXElement;

export type T_IconName = keyof typeof ICONS;

*/
