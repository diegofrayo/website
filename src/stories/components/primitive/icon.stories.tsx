import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Icon, { IconCatalog } from "~/components/primitive/icon";
import { ArgTypes } from "~/stories/config/arg-types";

// --- META ---

const meta: Meta<typeof Icon> = {
	title: "Primitive/Icon",
	component: Icon,
	tags: ["autodocs"],
	argTypes: {
		name: { control: "select", options: Object.keys(IconCatalog) },
		className: ArgTypes.tailwindColors,
		size: { control: "number" },
	},
	args: {
		name: IconCatalog.CHECK,
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Icon> = {
	args: {
		name: IconCatalog.CHECK,
	},
};

export const Large: StoryObj<typeof Icon> = {
	args: {
		name: IconCatalog.CIRCLE_USER,
	},
};
