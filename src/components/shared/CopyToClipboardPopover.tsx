import * as React from "react";

import Block from "~/components/primitive/Block";
import { copyToClipboard } from "@diegofrayo/utils/browser";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";

import Popover from "./Popover";

// --- PROPS & TYPES ---

type T_CopyToClipboardPopoverProps = {
	children: DR.React.Children;
	textToCopy: string;
};

function CopyToClipboardPopover({ children, textToCopy }: T_CopyToClipboardPopoverProps) {
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
			<Block is="span">
				{React.Children.map(children, (child) => {
					if (React.isValidElement(child)) {
						return React.cloneElement(child as DR.React.JSXElement, {
							onClick: () => {
								handleClick();

								if (v.isFunction(child.props.onClick)) {
									child.props.onClick();
								}
							},
						});
					}

					return null;
				})}
			</Block>
		</Popover>
	);
}

export default CopyToClipboardPopover;
