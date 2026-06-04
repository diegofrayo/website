import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toaster } from "sonner";
import { useArgs } from "storybook/internal/preview-api";

import toast from "~/components/common/toast";

// --- META ---

const meta: Meta = {
	title: "Common/Toast",
	component: toast,
	tags: ["autodocs"],
	argTypes: {
		message: { control: "text" },
		type: { control: "radio", options: ["success", "error", "default"] },
	},
	args: {
		type: "default",
	},
};

export default meta;

// --- STORIES ---

type Args = {
	type: "success" | "error" | "default";
	message: string;
};

export const Default: StoryObj<typeof toast> = {
	args: {
		message: "This is a toast message!",
	},
	render: () => {
		const [args] = useArgs<Args>();

		const handleClick = () => {
			if (args["type"] === "default") {
				toast(args["message"]);
			} else {
				toast[args["type"]](args["message"]);
			}
		};

		return (
			<div>
				<button
					onClick={handleClick}
					className="p-8"
				>
					Show Toast
				</button>
				<Toaster
					position="bottom-center"
					toastOptions={{
						classNames: {
							toast: "justify-center bg-white shadow-md text-black",
							closeButton: "bg-white text-black shadow-lg border border-zinc-300",
						},
					}}
					richColors={false}
					closeButton
				/>
			</div>
		);
	},
};
