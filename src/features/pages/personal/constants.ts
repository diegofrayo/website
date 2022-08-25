import { Icon } from "~/components/primitive";

export const PERSONAL_PAGES = [
	// personal
	{
		slug: "contacts",
		title: "contacts",
		componentName: "",
		icon: Icon.icon.USER_CIRCLE,
		type: "DATA",
	},
	{
		slug: "films",
		title: "films",
		componentName: "films/index",
		icon: Icon.icon.FILM,
		type: "DATA",
	},
	{
		slug: "timeline",
		title: "timeline",
		componentName: "timeline/index",
		icon: Icon.icon.PRESENTATION_CHART_LINE,
		type: "DATA",
	},
	{
		slug: "books",
		title: "books",
		componentName: "books/index",
		icon: Icon.icon.BOOK_OPEN,
		type: "DATA",
	},

	// tools
	{
		slug: "timer",
		title: "timer",
		componentName: "",
		icon: Icon.icon.CLOCK,
		type: "TOOL",
	},
	{
		slug: "ticks",
		title: "ticks",
		componentName: "",
		icon: Icon.icon.HEART,
		type: "TOOL",
	},
	{
		slug: "whatsapp",
		title: "whatsapp",
		componentName: "WhatsApp",
		icon: Icon.icon.CHAT,
		type: "TOOL",
	},
	{
		slug: "dencrypt",
		title: "dencrypt",
		componentName: "Dencrypt",
		icon: Icon.icon.KEY,
		type: "TOOL",
	},
	{
		slug: "text",
		title: "text",
		componentName: "Text",
		icon: Icon.icon.DOCUMENT_TEXT,
		type: "TOOL",
	},
	{
		slug: "isr",
		title: "isr",
		componentName: "ISR",
		icon: Icon.icon.REFRESH,
		type: "TOOL",
	},
	{
		slug: "debugging",
		title: "debugging",
		componentName: "Debugging",
		icon: Icon.icon.CODE,
		type: "TOOL",
	},
	{
		slug: "thumbnails",
		title: "thumbnails",
		componentName: "Thumbnails",
		icon: Icon.icon.PHOTO,
		type: "TOOL",
	},
] as const;
