import {
	ArrowDownTrayIcon,
	ArrowLeftEndOnRectangleIcon,
	ArrowPathIcon,
	ArrowTopRightOnSquareIcon,
	ArrowUpIcon,
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	Bars2Icon,
	Bars4Icon,
	Battery100Icon,
	Battery50Icon,
	BeakerIcon,
	BoltIcon,
	BoltSlashIcon,
	BookOpenIcon,
	BriefcaseIcon,
	BuildingStorefrontIcon,
	CalendarIcon,
	ChartBarSquareIcon,
	CheckIcon,
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ClipboardIcon,
	ClockIcon,
	CodeBracketIcon,
	CogIcon,
	CommandLineIcon,
	DocumentDuplicateIcon,
	DocumentTextIcon,
	EnvelopeIcon,
	ExclamationTriangleIcon,
	EyeIcon,
	EyeSlashIcon,
	FilmIcon,
	GlobeAltIcon,
	HeartIcon,
	HomeIcon,
	IdentificationIcon,
	KeyIcon,
	LinkIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	MusicalNoteIcon,
	NewspaperIcon,
	PauseIcon,
	PencilSquareIcon,
	PlayIcon,
	PresentationChartLineIcon,
	PrinterIcon,
	RssIcon,
	ServerIcon,
	Square3Stack3DIcon,
	StarIcon,
	TrophyIcon,
	TvIcon,
	UserCircleIcon,
	WindowIcon,
	WrenchIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	ChatBubbleLeftEllipsisIcon as ChatBubbleLeftEllipsisIconSolid,
	CheckBadgeIcon as CheckBadgeIconSolid,
	CurrencyDollarIcon as CurrencyDollarIconSolid,
	GlobeAltIcon as GlobeAltIconSolid,
	HeartIcon as HeartIconSolid,
	InformationCircleIcon as InformationCircleIconSolid,
	PhoneIcon as PhoneIconSolid,
	PlayIcon as PlayIconSolid,
	StarIcon as StarIconSolid,
	TagIcon as TagIconSolid,
	TrophyIcon as TrophyIconSolid,
	XCircleIcon as XCircleIconSolid,
} from "@heroicons/react/24/solid";
import {
	GithubMonoIcon,
	GmailMonoIcon,
	InstagramMonoIcon,
	LinkedinMonoIcon,
	SpotifyMonoIcon,
	TwitterMonoIcon,
	WhatsAppMonoIcon,
} from "./custom-icons";

const ICONS = {
	// --- OWN ICONS ---
	AIRBNB: {
		icon: "/assets/images/icons/airbnb.png",
		defaultProps: {
			alt: "AirBnb",
			className: "",
		},
	},
	GITHUB: {
		icon: "/assets/images/icons/github.svg",
		defaultProps: {
			alt: "GitHub",
			className: "",
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
			className: "",
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
	GOOGLE: {
		icon: "/assets/images/icons/google.svg",
		defaultProps: {
			alt: "Google",
		},
	},
	INSTAGRAM: {
		icon: "/assets/images/icons/instagram.svg",
		defaultProps: {
			alt: "Instagram",
			className: "",
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
			className: "",
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
			className: "",
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
			className: "",
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
			className: "",
		},
	},
	WEBSITE: {
		icon: GlobeAltIconSolid,
		defaultProps: {
			className: "",
			color: "",
			size: 26,
		},
	},
	WHATSAPP: {
		icon: "/assets/images/icons/whatsapp.svg",
		defaultProps: {
			alt: "WhatsApp",
			className: "",
		},
	},
	WHATSAPP_MONO: {
		icon: WhatsAppMonoIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	YOUTUBE: {
		icon: "/assets/images/icons/youtube.svg",
		defaultProps: {
			alt: "YouTube",
			className: "",
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
	ARROWS_POINTING_IN: {
		icon: ArrowsPointingInIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	ARROWS_POINTING_OUT: {
		icon: ArrowsPointingOutIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BARS_2: {
		icon: Bars2Icon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BARS_4: {
		icon: Bars4Icon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BATTERY_50: {
		icon: Battery50Icon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BATTERY_100: {
		icon: Battery100Icon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BEAKER: {
		icon: BeakerIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BOOK: {
		icon: BookOpenIcon,
		defaultProps: {
			className: "",
		},
	},
	BRIEFCASE: {
		icon: BriefcaseIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BOLT: {
		icon: BoltIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	BOLT_SLASH: {
		icon: BoltSlashIcon,
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
	CHART_BAR_SQUARE: {
		icon: ChartBarSquareIcon,
		defaultProps: {
			className: "",
			color: "",
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
			color: "",
		},
	},
	COMMAND_LINE: {
		icon: CommandLineIcon,
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
	EXIT: {
		icon: ArrowLeftEndOnRectangleIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	EYE: {
		icon: EyeIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	EYE_SLASH: {
		icon: EyeSlashIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	FILM: {
		icon: FilmIcon,
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
	HOME: {
		icon: HomeIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	IDENTIFICATION: {
		icon: IdentificationIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	INFO: {
		icon: InformationCircleIconSolid,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	KEY: {
		icon: KeyIcon,
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
	MONEY: {
		icon: CurrencyDollarIconSolid,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	MUSIC_NOTE: {
		icon: MusicalNoteIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	NEWSPAPER: {
		icon: NewspaperIcon,
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
	PHONE_SOLID: {
		icon: PhoneIconSolid,
		defaultProps: {
			className: "",
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
		icon: PlayIconSolid,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	PRESENTATION_CHART_LINE: {
		icon: PresentationChartLineIcon,
		defaultProps: {
			className: "",
			color: "",
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
	SERVER: {
		icon: ServerIcon,
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
	STAR: {
		icon: StarIcon,
		defaultProps: {
			className: "",
			color: "tw-text-yellow-500",
		},
	},
	STAR_SOLID: {
		icon: StarIconSolid,
		defaultProps: {
			className: "",
			color: "tw-text-yellow-500",
		},
	},
	STORE: {
		icon: BuildingStorefrontIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	TAG: {
		icon: TagIconSolid,
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
	TROPHY: {
		icon: TrophyIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	TROPHY_SOLID: {
		icon: TrophyIconSolid,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	TV: {
		icon: TvIcon,
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
	X: {
		icon: XMarkIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	X_SOLID: {
		icon: XCircleIconSolid,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	ZOOM_IN: {
		icon: MagnifyingGlassPlusIcon,
		defaultProps: {
			className: "",
			color: "",
		},
	},
	ZOOM_OUT: {
		icon: MagnifyingGlassMinusIcon,
		defaultProps: {
			className: "",
		},
		color: "",
	},
};

export default ICONS;

/*
export const ICONS = {
	ARCHIVE_BOX: {
		icon: ArchiveBoxIcon,
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
	PHONE: {
		icon: PhoneIcon,
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
	SUN: {
		icon: SunIcon,
		defaultProps: {
			color: "",
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
