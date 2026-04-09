import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Pre from "~/components/primitive/pre";

// --- META ---

const meta: Meta<typeof Pre> = {
	title: "Primitive/Pre",
	component: Pre,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: Object.values(Pre.variant),
		},
		children: { control: "text" },
		className: { control: "text" },
	},
	args: {
		variant: "UNSTYLED",
		children:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique nobis vero necessitatibus? Quidem cupiditate unde, inventore quam eligendi harum ducimus, voluptates consequuntur voluptatum quae ad distinctio eveniet perspiciatis exercitationem earum? VeryLongWordWordWordWordWordWordWordWord VeryLongWordWordWordWordWordWordWordWord VeryLongWordWordWordWordWordWordWordWord VeryLongWordWordWordWordWordWordWordWord",
		className: "overflow-auto w-96 border border-red-900 bg-red-400 p-8",
	},
};

export default meta;

// --- STORIES ---

export const Unstyled: StoryObj<typeof Pre> = {
	args: {
		variant: "UNSTYLED",
	},
};

export const BreakWithBlankLines: StoryObj<typeof Pre> = {
	args: {
		variant: "BREAK_WITH_BLANK_LINES",
	},
};

export const BreakWithBlankSpaces: StoryObj<typeof Pre> = {
	args: {
		variant: "BREAK_WITH_BLANK_SPACES",
	},
};

export const BreakWords: StoryObj<typeof Pre> = {
	args: {
		variant: "BREAK_WORDS",
	},
};
