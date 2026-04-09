import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip as RadixTooltip } from "radix-ui";

import Tooltip from "~/components/common/tooltip";

// --- META ---

const meta: Meta<typeof Tooltip> = {
	title: "Shared/Tooltip",
	component: Tooltip,
	tags: ["autodocs"],
	argTypes: {
		text: { control: "text" },
		triggerAsChild: { control: "boolean" },
		children: { control: false },
	},
	args: {
		text: "Tooltip text!",
		triggerAsChild: true,
		children: <button style={{ padding: 8 }}>Hover me</button>,
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Tooltip> = {
	render() {
		return (
			<div>
				<RadixTooltip.Provider>
					<Tooltip
						text="This is a tooltip"
						triggerAsChild
					>
						<p className="text-center">Hover me!</p>
					</Tooltip>
				</RadixTooltip.Provider>
			</div>
		);
	},
};
