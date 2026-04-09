import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Image from "~/components/primitive/image";

// --- META ---

const meta: Meta<typeof Image> = {
	title: "Primitive/Image",
	component: Image,
	tags: ["autodocs"],
	argTypes: {
		alt: { control: "text" },
		src: { control: "text" },
		useNativeElement: { control: "boolean" },
		width: { control: "number" },
		height: { control: "number" },
	},
	args: {
		alt: "Sample image",
		src: "https://placehold.co/100x100",
		width: 100,
		height: 100,
		useNativeElement: false,
	},
};

export default meta;

// --- STORIES ---

export const NextImage: StoryObj<typeof Image> = {
	args: {
		useNativeElement: false,
		src: "https://placehold.co/100x100",
		alt: "Next.js Image",
		width: 100,
		height: 100,
	},
};

export const NativeImage: StoryObj<typeof Image> = {
	args: {
		useNativeElement: true,
		src: "https://placehold.co/100x100",
		alt: "Native img",
		width: 100,
		height: 100,
	},
};
