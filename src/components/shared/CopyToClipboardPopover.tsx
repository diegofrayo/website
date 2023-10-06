import * as React from "react";

import { Button } from "~/components/primitive";
import { copyToClipboard } from "@diegofrayo/utils/browser";
import type DR from "@diegofrayo/types";

import Popover from "./Popover";

// --- PROPS & TYPES ---

type T_CopyToClipboardPopoverProps = {
	children: DR.React.Children;
	textToCopy: string;
	buttonClassName?: string;
};

function CopyToClipboardPopover({
	children,
	textToCopy,
	buttonClassName,
}: T_CopyToClipboardPopoverProps) {
	// --- STATES & REFS ---
	const [showPopover, setShowPopover] = React.useState(false);

	// --- HANDLERS ---
	function handleClick(): void {
		copyToClipboard(textToCopy);
		setShowPopover((currentValue) => {
			if (currentValue) {
				return true;
			}

			setTimeout(() => setShowPopover(false), 2000);
			return !currentValue;
		});
	}

	return (
		<Popover
			text="copied!"
			open={showPopover}
		>
			<Button
				variant={Button.variant.SIMPLE}
				className={buttonClassName}
				onClick={handleClick}
			>
				{children}
			</Button>
		</Popover>
	);
}

export default CopyToClipboardPopover;
