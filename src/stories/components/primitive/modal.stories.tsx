import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";

import { Button } from "~/components/primitive";
import Modal from "~/components/primitive/modal";

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
					className="bg-red-800 p-4 open:block"
					onCloseHandler={() => setArgs({ ...args, visible: false })}
				>
					<Button
						variant={Button.variant.SMOOTH}
						className="ml-auto block font-bold text-white"
						onClick={() => setArgs({ ...args, visible: false })}
					>
						X
					</Button>

					<p className="mt-2 text-red-300">modal is visible</p>
				</Modal>
			</div>
		);
	},
};
