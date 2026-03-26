import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";

import { Button } from "@diegofrayo-features/components/primitive";
import Modal from "@diegofrayo-features/components/primitive/modal";

// --- META ---

const meta: Meta<typeof Modal> = {
	title: "Primitive/Modal",
	component: Modal,
	tags: ["autodocs"],
	argTypes: {
		visible: { control: "boolean" },
		className: { control: "text" },
		onCloseHandler: { action: "onCloseHandler" },
	},
	args: {
		visible: false,
		className: "",
	},
};

export default meta;

// --- STORIES ---

export const Visible: StoryObj<typeof Modal> = {
	args: {
		visible: false,
	},
	render: () => {
		const [args, setArgs] = useArgs();

		return (
			<div className="">
				<button onClick={() => setArgs({ ...args, visible: true })}>open modal</button>
				<Modal
					visible={args["visible"]}
					onCloseHandler={() => setArgs({ ...args, visible: false })}
					className="bg-red-800"
				>
					<p>modal is visible</p>
					<Button
						variant={Button.variant.STYLED}
						onClick={() => setArgs({ ...args, visible: false })}
					>
						close modal
					</Button>
				</Modal>
			</div>
		);
	},
};
