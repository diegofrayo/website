import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Callout from "~/components/common/callout";

// --- META ---

const meta: Meta<typeof Callout> = {
	title: "Common/Callout",
	component: Callout,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: Object.values(Callout.variant),
		},
		children: { control: "text" },
	},
	args: {
		variant: "ERROR",
		children: "This is an error callout.",
	},
};

export default meta;

// --- STORIES ---

export const Error: StoryObj<typeof Callout> = {};

export const Warning: StoryObj<typeof Callout> = {
	args: {
		variant: "WARNING",
		children: "This is a warning callout.",
	},
};
