import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Button from "~/components/primitive/button";

// --- META ---

const meta: Meta<typeof Button> = {
	title: "Primitive/Button",
	component: Button,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "radio",
			options: ["SM", "BASE"],
		},
		variant: {
			control: "radio",
			options: Object.values(Button.variant),
		},
		disabled: {
			control: "boolean",
		},
		children: {
			control: "text",
		},
	},
	args: {
		children: "Button",
		size: "BASE",
		variant: "STYLED",
		disabled: false,
		onClick: () => alert("Button clicked!"),
	},
};

export default meta;

// --- STORIES ---

export const Styled: StoryObj<typeof Button> = {
	args: {
		variant: "STYLED",
		children: "Styled Button",
	},
};

export const Smooth: StoryObj<typeof Button> = {
	args: {
		variant: "SMOOTH",
		children: "Smooth Button",
	},
};

export const Unstyled: StoryObj<typeof Button> = {
	args: {
		variant: "UNSTYLED",
		children: "Unstyled Button",
	},
};

export const Disabled: StoryObj<typeof Button> = {
	args: {
		disabled: true,
		children: "Disabled Button",
	},
};
