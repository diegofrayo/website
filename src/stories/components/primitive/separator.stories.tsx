import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type ReactTypes from "@diegofrayo-pkg/types/react";

import Separator, { SeparatorVariant } from "~/components/primitive/separator";

// --- META ---

const meta: Meta<typeof Separator> = {
	title: "Primitive/Separator",
	component: Separator,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: Object.values(SeparatorVariant),
		},
		orientation: {
			control: "radio",
			options: ["HORIZONTAL", "VERTICAL"],
		},
		size: { control: "number" },
		className: { control: "text" },
	},
	args: {
		variant: "UNSTYLED",
		orientation: "HORIZONTAL",
		size: 16,
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Unstyled: StoryObj<typeof Separator> = {
	args: {
		variant: "UNSTYLED",
		orientation: "HORIZONTAL",
		size: 2,
	},
	decorators: [
		(Story): ReactTypes.JSXElement => (
			<div>
				<p>Element 1</p>
				<Story />
				<p>Element 2</p>
			</div>
		),
	],
};

export const Simple: StoryObj<typeof Separator> = {
	args: {
		variant: "SIMPLE",
		orientation: "HORIZONTAL",
		size: 1.5,
	},
	decorators: [
		(Story): ReactTypes.JSXElement => (
			<div>
				<p>Element 1</p>
				<Story />
				<p>Element 2</p>
			</div>
		),
	],
};

export const Dashed: StoryObj<typeof Separator> = {
	args: {
		variant: "DASHED",
		orientation: "VERTICAL",
		size: 4,
	},
	decorators: [
		(Story): ReactTypes.JSXElement => (
			<div className="flex gap-2">
				<p>Element 1</p>
				<Story />
				<p>Element 2</p>
			</div>
		),
	],
};
