import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Collapsible from "@diegofrayo-features/components/primitive/collapsible";

// --- META ---

const meta: Meta<typeof Collapsible> = {
	title: "Primitive/Collapsible",
	component: Collapsible,
	tags: ["autodocs"],
	argTypes: {
		title: { control: "text" },
		openedByDefault: { control: "boolean" },
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		title: "Collapsible Title",
		openedByDefault: false,
		children: "Collapsible content goes here.",
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Closed: StoryObj<typeof Collapsible> = {
	args: {
		openedByDefault: false,
		title: "Closed by default",
		children: "This content is hidden until expanded.",
		contentClassName: "bg-zinc-300",
		titleClassName: "text-red-800",
		onShowContentHandler: () => alert("Content shown!"),
		onHideContentHandler: () => alert("Content hidden!"),
	},
};

export const Opened: StoryObj<typeof Collapsible> = {
	args: {
		openedByDefault: true,
		title: "Opened by default",
		children: "This content is visible by default.",
	},
};

export const WithCustomTitle: StoryObj<typeof Collapsible> = {
	args: {
		title: (
			<div className="flex gap-3 bg-zinc-400">
				<h1>{`> Custom title`}</h1>
				<button onClick={() => alert("hey!")}>button</button>
				<a href="javascript::void">link</a>
			</div>
		),
		children: "The title is a custom component",
	},
};
