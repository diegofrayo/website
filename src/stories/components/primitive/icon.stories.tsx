import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Icon, { IconCatalog } from "~/components/primitive/icon";
import { ArgTypes } from "~/stories/config/arg-types";

// --- META ---

const meta: Meta<typeof Icon> = {
	title: "Primitive/Icon",
	component: Icon,
	tags: ["autodocs"],
	argTypes: {
		icon: { control: "select", options: Object.keys(IconCatalog) },
		color: ArgTypes.tailwindColors,
		size: { control: "number" },
	},
	args: {
		icon: IconCatalog.CHECK,
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Icon> = {
	args: {
		icon: IconCatalog.CHECK,
	},
};

export const Large: StoryObj<typeof Icon> = {
	args: {
		icon: IconCatalog.CIRCLE_USER,
	},
};
