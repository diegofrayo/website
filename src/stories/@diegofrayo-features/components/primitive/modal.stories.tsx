import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Modal from "@diegofrayo-features/components/primitive/modal";

// --- META ---

const meta: Meta<typeof Modal> = {
	title: "Primitive/Modal",
	component: Modal,
	tags: ["autodocs"],
	argTypes: {
		visible: { control: "boolean" },
		className: { control: "text" },
		children: { control: "text" },
		onCloseHandler: { action: "onCloseHandler" },
	},
	args: {
		visible: true,
		className: "",
		children: "This is a Modal.",
	},
};

export default meta;

// --- STORIES ---

export const Visible: StoryObj<typeof Modal> = {
	args: {
		visible: true,
		children: "This is a visible Modal.",
	},
};

export const Hidden: StoryObj<typeof Modal> = {
	args: {
		visible: false,
		children: "This Modal is hidden.",
	},
};
