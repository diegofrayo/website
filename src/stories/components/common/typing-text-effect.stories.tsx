import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import TypingTextEffect from "~/components/common/typing-text-effect";

// --- META ---

const meta: Meta<typeof TypingTextEffect> = {
	title: "Shared/TypingTextEffect",
	component: TypingTextEffect,
	tags: ["autodocs"],
	argTypes: {
		align: {
			control: "radio",
			options: Object.values(TypingTextEffect.align),
		},
		text: { control: "text" },
		className: { control: "text" },
	},
	args: {
		align: "CENTER",
		text: "Typing text effect example...",
		className: "text-lg",
	},
};

export default meta;

// --- STORIES ---

export const Centered: StoryObj<typeof TypingTextEffect> = {};

export const LeftAligned: StoryObj<typeof TypingTextEffect> = {
	args: {
		align: "LEFT",
		text: "Left aligned typing text...",
	},
};
