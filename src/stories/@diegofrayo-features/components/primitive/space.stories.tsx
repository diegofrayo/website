import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Space from "@diegofrayo-features/components/primitive/space";

// --- META ---

const meta: Meta<typeof Space> = {
	title: "Primitive/Space",
	component: Space,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: Object.values(Space.variant),
		},
		orientation: {
			control: "radio",
			options: ["h", "v"],
		},
		size: { control: "number" },
		className: { control: "text" },
	},
	args: {
		variant: "UNSTYLED",
		orientation: "h",
		size: 16,
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Unstyled: StoryObj<typeof Space> = {
	args: {
		variant: "UNSTYLED",
		orientation: "h",
		size: 2,
	},
	decorators: [
		(Story) => (
			<div>
				<p>Element 1</p>
				<Story />
				<p>Element 2</p>
			</div>
		),
	],
};

export const Simple: StoryObj<typeof Space> = {
	args: {
		variant: "SIMPLE",
		orientation: "h",
		size: 1.5,
	},
	decorators: [
		(Story) => (
			<div>
				<p>Element 1</p>
				<Story />
				<p>Element 2</p>
			</div>
		),
	],
};

export const Dashed: StoryObj<typeof Space> = {
	args: {
		variant: "DASHED",
		orientation: "v",
		size: 4,
	},
	decorators: [
		(Story) => (
			<div className="flex gap-2">
				<p>Element 1</p>
				<Story />
				<p>Element 2</p>
			</div>
		),
	],
};
