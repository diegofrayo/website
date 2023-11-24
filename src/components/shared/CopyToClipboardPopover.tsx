import * as React from "react";

import Block from "~/components/primitive/Block";
import type DR from "@diegofrayo/types";
import { copyToClipboard } from "@diegofrayo/utils/browser";
import v from "@diegofrayo/v";

import Popover from "./Popover";

// --- PROPS & TYPES ---

type T_CopyToClipboardPopoverProps = {
	children: DR.React.Children;
	textToCopy: string | (() => string);
	popoverText?: string;
};

function CopyToClipboardPopover({
	children,
	textToCopy,
	popoverText = "copied!",
}: T_CopyToClipboardPopoverProps) {
	// --- STATES & REFS ---
	const [showPopover, setShowPopover] = React.useState(false);

	// --- HANDLERS ---
	function handleClick() {
		copyToClipboard(v.isString(textToCopy) ? textToCopy : textToCopy());
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
			text={popoverText}
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
