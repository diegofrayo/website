import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Playground from "@diegofrayo-features/components/shared/playground";

// --- META ---

const meta: Meta<typeof Playground> = {
	title: "Shared/Playground",
	component: Playground,
	tags: ["autodocs"],
	argTypes: {
		Preview: { control: false },
		height: { control: "number" },
		language: { control: "text" },
		sourceCode: { control: "text" },
		title: { control: "text" },
	},
	args: {
		Preview: () => <div className="p-6">Preview content here</div>,
		height: 300,
		language: "tsx",
		sourceCode: "<div>Preview content here</div>",
		title: "Playground Example",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Playground> = {};
