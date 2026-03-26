import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import InlineText from "@diegofrayo-features/components/primitive/inline-text";

// --- META ---

const meta: Meta<typeof InlineText> = {
	title: "Primitive/InlineText",
	component: InlineText,
	tags: ["autodocs"],
	argTypes: {
		as: {
			control: "radio",
			options: ["span", "strong"],
		},
		children: { control: "text" },
	},
	args: {
		as: "span",
		children: "Inline text content.",
	},
};

export default meta;

// --- STORIES ---

export const Span: StoryObj<typeof InlineText> = {
	args: {
		as: "span",
		children: "This is a span.",
	},
};

export const Strong: StoryObj<typeof InlineText> = {
	args: {
		as: "strong",
		children: "This is strong text.",
	},
};
