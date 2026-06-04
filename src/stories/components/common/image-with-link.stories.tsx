import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ImageWithLink from "~/components/common/image-with-link";

// --- META ---

const meta: Meta<typeof ImageWithLink> = {
	title: "Common/ImageWithLink",
	component: ImageWithLink,
	tags: ["autodocs"],
	argTypes: {
		src: { control: "text" },
		alt: { control: "text" },
		className: { control: "text" },
	},
	args: {
		src: "https://placehold.co/300x200",
		alt: "Placeholder image",
		className: "w-64",
		width: 300,
		height: 300,
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof ImageWithLink> = {};
