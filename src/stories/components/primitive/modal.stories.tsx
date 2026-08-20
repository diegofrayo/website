import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";

import cn from "@diegofrayo-pkg/cn";

import { Button } from "~/components/primitive";
import Modal from "~/components/primitive/modal";

// --- META ---

type StoryMeta = Meta<typeof Modal>;
type StoryArgs = NonNullable<Required<StoryMeta["args"]>>;

const meta: StoryMeta = {
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
		const [args, setArgs] = useArgs<StoryArgs>();

		return (
			<div className="">
				<button onClick={() => setArgs({ ...args, visible: true })}>open modal</button>
				<Modal
					visible={args["visible"]}
					className={cn("bg-red-800 p-4 open:block", args.className)}
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
