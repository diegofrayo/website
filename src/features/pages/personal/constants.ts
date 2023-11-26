import { Icon } from "~/components/primitive";

export const PERSONAL_PAGES = [
	// tools
	{
		slug: "ticks",
		title: "ticks",
		componentName: "",
		icon: Icon.icon.HEART,
		type: "TOOL",
	},
	{
		slug: "stopwatch",
		title: "stopwatch",
		componentName: "",
		icon: Icon.icon.CLOCK,
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
		slug: "text",
		title: "text",
		componentName: "Text",
		icon: Icon.icon.DOCUMENT_TEXT,
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
	{
		slug: "timer",
		title: "timer",
		componentName: "",
		icon: Icon.icon.ARCHIVE_BOX,
		type: "TOOL",
	},
] as const;
