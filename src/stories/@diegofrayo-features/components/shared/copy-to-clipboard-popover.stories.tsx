import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CopyToClipboardPopover from "@diegofrayo-features/components/shared/copy-to-clipboard-popover";

// --- META ---

const meta: Meta<typeof CopyToClipboardPopover> = {
	title: "Shared/CopyToClipboardPopover",
	component: CopyToClipboardPopover,
	tags: ["autodocs"],
	argTypes: {
		textToCopy: { control: "text" },
		popoverText: { control: "text" },
	},
	args: {
		textToCopy: "Hello, clipboard!",
		popoverText: "Copied!",
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof CopyToClipboardPopover> = {
	render: () => {
		return (
			<div className="flex items-center gap-2">
				<p>Text to copy</p>

				<CopyToClipboardPopover textToCopy="Text to copy">
					<button className="border border-black p-1">copy</button>
				</CopyToClipboardPopover>
			</div>
		);
	},
};
