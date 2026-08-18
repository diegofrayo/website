import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SourceCode from "~/components/common/source-code";

// --- META ---

const meta: Meta<typeof SourceCode> = {
	title: "Common/SourceCode",
	component: SourceCode,
	tags: ["autodocs"],
	argTypes: {
		code: { control: "text" },
		sourceURL: { control: "text" },
		className: { control: "text" },
		title: { control: "text" },
		language: { control: "text" },
	},
	args: {
		code: "const hello = 'world';\nconsole.log(hello);",
		sourceURL:
			"https://github.com/diegofrayo/website/blob/master/src/stories/components/common/source-code.stories.tsx",
		className: "w-96",
		title: "Example Source Code",
		language: "js",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof SourceCode> = {};
