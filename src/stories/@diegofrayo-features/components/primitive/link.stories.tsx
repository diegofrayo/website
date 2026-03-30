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
			options: Object.values(Link.variant),
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
		children: "Styled and External Link",
		href: "https://storybook.js.org/",
		isExternalLink: true,
	},
};

export const Smooth: StoryObj<typeof Link> = {
	args: {
		variant: "SMOOTH",
		children: "Smooth Link",
		href: "http://localhost:6006/?path=/docs/primitive-link--docs#smooth-1",
	},
};

export const Unstyled: StoryObj<typeof Link> = {
	args: {
		variant: "UNSTYLED",
		children: "Unstyled Link",
		href: "http://localhost:6006/?path=/docs/primitive-link--docs#unstyled",
	},
};
