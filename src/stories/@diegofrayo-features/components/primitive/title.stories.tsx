import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Title from "@diegofrayo-features/components/primitive/title";

// --- META ---

const meta: Meta<typeof Title> = {
	title: "Primitive/Title",
	component: Title,
	tags: ["autodocs"],
	argTypes: {
		as: {
			control: "select",
			options: ["h1", "h2", "h3", "h4", "h5", "h6"],
		},
		size: {
			control: "radio",
			options: ["SM", "MD", "LG", "XL"],
		},
		variant: {
			control: "radio",
			options: ["UNSTYLED", "SIMPLE", "STYLED"],
		},
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		as: "h1",
		size: "LG",
		variant: "STYLED",
		children: "Title Component",
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Styled: StoryObj<typeof Title> = {
	args: {
		as: "h1",
		size: "LG",
		variant: "STYLED",
		children: "Styled Title",
	},
};

export const Simple: StoryObj<typeof Title> = {
	args: {
		as: "h2",
		size: "MD",
		variant: "SIMPLE",
		children: "Simple Title",
	},
};

export const Unstyled: StoryObj<typeof Title> = {
	args: {
		as: "h3",
		size: "SM",
		variant: "UNSTYLED",
		children: "Unstyled Title",
	},
};
