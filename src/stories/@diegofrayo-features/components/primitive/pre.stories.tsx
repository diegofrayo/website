import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Pre from "@diegofrayo-features/components/primitive/pre";

// --- META ---

const meta: Meta<typeof Pre> = {
	title: "Primitive/Pre",
	component: Pre,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: ["UNSTYLED", "BREAK_WITH_BLANK_LINES", "BREAK_WITH_BLANK_SPACES", "BREAK_WORDS"],
		},
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		variant: "UNSTYLED",
		children: "const foo = 'bar';\nconsole.log(foo);",
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Unstyled: StoryObj<typeof Pre> = {
	args: {
		variant: "UNSTYLED",
		children: "const foo = 'bar';\nconsole.log(foo);",
	},
};

export const BreakWithBlankLines: StoryObj<typeof Pre> = {
	args: {
		variant: "BREAK_WITH_BLANK_LINES",
		children: "Line 1\n\nLine 2\n\nLine 3",
	},
};

export const BreakWithBlankSpaces: StoryObj<typeof Pre> = {
	args: {
		variant: "BREAK_WITH_BLANK_SPACES",
		children: "Word1    Word2    Word3",
	},
};

export const BreakWords: StoryObj<typeof Pre> = {
	args: {
		variant: "BREAK_WORDS",
		children: "ThisIsAReallyLongWordThatShouldBreak",
	},
};
