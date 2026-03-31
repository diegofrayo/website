import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Popover from "@diegofrayo-features/components/shared/popover";

// --- META ---

const meta: Meta<typeof Popover> = {
	title: "Shared/Popover",
	component: Popover,
	tags: ["autodocs"],
	argTypes: {
		text: { control: "text" },
		open: { control: "boolean" },
		children: { control: false },
	},
	args: {
		text: "Popover content!",
		open: true,
		children: <button style={{ padding: 8 }}>Trigger Popover</button>,
	},
};

export default meta;

// --- STORIES ---

export const Default: StoryObj<typeof Popover> = {
	render: () => {
		const popoverText = "This is a popover!";
		const [showPopover, setShowPopover] = useState(false);
		const handleClick = () => {
			setShowPopover((currentValue) => {
				if (currentValue) {
					return true;
				}

				setTimeout(() => setShowPopover(false), 2000);
				return !currentValue;
			});
		};

		return (
			<Popover
				text={popoverText}
				open={showPopover}
				nativeButton={false}
			>
				<button onClick={handleClick}>Show Popover</button>
			</Popover>
		);
	},
};
