import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Code from "@diegofrayo-features/components/primitive/code";

// --- META ---

const meta: Meta<typeof Code> = {
	title: "Primitive/Code",
	component: Code,
	tags: ["autodocs"],
	argTypes: {
		children: { control: "text" },
		variant: {
			control: "radio",
			options: ["UNSTYLED", "ENHANCED"],
		},
		className: { control: "text" },
	},
	args: {
		children: "const x = 42;",
		variant: "UNSTYLED",
		className: "",
	},
	decorators: [
		(Story) => (
			<div className="p-8">
				<Story />
			</div>
		),
	],
};

export default meta;

// --- STORIES ---

export const Unstyled: StoryObj<typeof Code> = {
	args: {
		variant: "UNSTYLED",
		children: "console.log('Hello, world!');",
	},
};

export const Enhanced: StoryObj<typeof Code> = {
	args: {
		variant: "ENHANCED",
		children: "npm install @storybook/react",
	},
	globals: {},
};
