import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import RenderData from "~/components/common/render-data";

// --- META ---

const meta: Meta<typeof RenderData> = {
	title: "Shared/RenderData",
	component: RenderData,
	tags: ["autodocs"],
	argTypes: {
		isLoading: { control: "boolean" },
		error: { control: "text" },
		data: { control: "object" },
		children: { control: false },
	},
	args: {
		isLoading: false,
		error: undefined,
		data: { message: "Hello, world!" },
		children: (data) => {
			const args = data as { message: string };
			return <div>Data: {args.message}</div>;
		},
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof RenderData> = {};

export const Loading: StoryObj<typeof RenderData> = {
	args: {
		isLoading: true,
		data: undefined,
		error: undefined,
	},
};

export const Error: StoryObj<typeof RenderData> = {
	args: {
		isLoading: false,
		data: undefined,
		error: "Something went wrong!",
	},
};
