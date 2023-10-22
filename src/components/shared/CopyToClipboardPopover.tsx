import * as React from "react";

import Button from "~/components/primitive/Button";
import { copyToClipboard } from "@diegofrayo/utils/browser";
import type DR from "@diegofrayo/types";

import Popover from "./Popover";

// --- PROPS & TYPES ---

type T_CopyToClipboardPopoverProps = {
	children: DR.React.Children;
	textToCopy: string;
	className?: string;
};

function CopyToClipboardPopover({
	children,
	textToCopy,
	className,
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
				className={className}
				onClick={handleClick}
			>
				{children}
			</Button>
		</Popover>
	);
}

export default CopyToClipboardPopover;
