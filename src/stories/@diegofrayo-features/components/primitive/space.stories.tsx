import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Space from "@diegofrayo-features/components/primitive/space";

// --- META ---

const meta: Meta<typeof Space> = {
	title: "Primitive/Space",
	component: Space,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: ["UNSTYLED", "SIMPLE", "DASHED"],
		},
		orientation: {
			control: "radio",
			options: ["h", "v"],
		},
		size: { control: "number" },
		clasName: { control: "text" },
	},
	args: {
		variant: "UNSTYLED",
		orientation: "h",
		size: 16,
		clasName: "",
	},
};

export default meta;

// --- STORIES ---

export const Unstyled: StoryObj<typeof Space> = {
	args: {
		variant: "UNSTYLED",
		orientation: "h",
		size: 16,
	},
};

export const Simple: StoryObj<typeof Space> = {
	args: {
		variant: "SIMPLE",
		orientation: "h",
		size: 24,
	},
};

export const Dashed: StoryObj<typeof Space> = {
	args: {
		variant: "DASHED",
		orientation: "v",
		size: 32,
	},
};
