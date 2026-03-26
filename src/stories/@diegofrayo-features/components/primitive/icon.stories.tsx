import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Icon, IconCatalog } from "@diegofrayo-features/components/primitive/icon";

// --- META ---

const meta: Meta<typeof Icon> = {
	title: "Primitive/Icon",
	component: Icon,
	tags: ["autodocs"],
	argTypes: {
		icon: { control: "select", options: Object.keys(IconCatalog) },
		color: { control: "text" },
		size: { control: "number" },
		className: { control: "text" },
	},
	args: {
		icon: IconCatalog.CHECK,
		color: "#000000",
		size: 24,
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Icon> = {
	args: {
		icon: IconCatalog.CHECK,
		color: "#000000",
		size: 24,
	},
};

export const Large: StoryObj<typeof Icon> = {
	args: {
		icon: IconCatalog.CIRCLE_USER,
		color: "#000000",
		size: 48,
	},
};
