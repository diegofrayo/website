import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ImageGallery from "~/components/common/image-gallery";

// --- META ---

const meta: Meta<typeof ImageGallery> = {
	title: "Common/ImageGallery",
	component: ImageGallery,
	tags: ["autodocs"],
	argTypes: {
		id: { control: "text" },
		images: { control: "object" },
		noBounds: { control: "boolean" },
		className: { control: "text" },
	},
	args: {
		id: "gallery-1",
		images: [
			{ url: "https://placehold.co/300x200?text=1", alt: "Image 1" },
			{ url: "https://placehold.co/300x200?text=2", alt: "Image 2" },
			{ url: "https://placehold.co/300x200?text=3", alt: "Image 3" },
		],
		noBounds: false,
		className: "w-96",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof ImageGallery> = {};
