import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Link from "@diegofrayo-features/components/primitive/link";

// --- META ---

const meta: Meta<typeof Link> = {
	title: "Primitive/Link",
	component: Link,
	tags: ["autodocs"],
	argTypes: {
		href: { control: "text" },
		variant: {
			control: "radio",
			options: ["UNSTYLED", "SMOOTH", "STYLED"],
		},
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		href: "https://storybook.js.org/",
		variant: "STYLED",
		children: "Storybook Link",
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Styled: StoryObj<typeof Link> = {
	args: {
		variant: "STYLED",
		children: "Styled Link",
		href: "https://storybook.js.org/",
	},
};

export const Smooth: StoryObj<typeof Link> = {
	args: {
		variant: "SMOOTH",
		children: "Smooth Link",
		href: "https://storybook.js.org/",
	},
};

export const Unstyled: StoryObj<typeof Link> = {
	args: {
		variant: "UNSTYLED",
		children: "Unstyled Link",
		href: "https://storybook.js.org/",
	},
};
