import { Tooltip as BaseUITooltip } from "@base-ui/react/tooltip";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Tooltip from "~/components/common/tooltip";

// --- META ---

const meta: Meta<typeof Tooltip> = {
	title: "Common/Tooltip",
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
				<BaseUITooltip.Provider>
					<Tooltip
						text="This is a tooltip"
						triggerAsChild
					>
						<span className="text-center">Hover me!</span>
					</Tooltip>
				</BaseUITooltip.Provider>
			</div>
		);
	},
};
