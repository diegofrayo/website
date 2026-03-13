import { Children, cloneElement, isValidElement, useState } from "react";
import type { PopoverPositionerProps } from "@base-ui/react";

import type DR from "@diegofrayo-pkg/types";
import { copyToClipboard } from "@diegofrayo-pkg/utilities/browser";
import { isFunction, isString } from "@diegofrayo-pkg/validator";

import { Box } from "../primitive";
import Popover from "./popover";

export type CopyToClipboardPopoverProps = PopoverPositionerProps & {
	textToCopy: string | (() => string);
	popoverText?: string;
};

function CopyToClipboardPopover({
	children,
	textToCopy,
	popoverText = "copied!",
	...rest
}: CopyToClipboardPopoverProps) {
	// --- STATE & REFS ---
	const [showPopover, setShowPopover] = useState(false);

	// --- HANDLERS ---
	function handleClick() {
		copyToClipboard(isString(textToCopy) ? textToCopy : textToCopy());
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
			{...rest}
		>
			<Box as="span">
				{Children.map(children, (child) => {
					if (isValidElement<ChildElementProps>(child)) {
						return cloneElement(child as DR.React.JSXElement, {
							onClick: (event: DR.React.Events.OnChangeEvent<HTMLButtonElement>) => {
								handleClick();

								if (isFunction(child.props.onClick)) {
									child.props.onClick(event);
								}
							},
						});
					}

					return null;
				})}
			</Box>
		</Popover>
	);
}

export default CopyToClipboardPopover;

// --- TYPES ---

type ChildElementProps = {
	onClick?: (event: DR.React.Events.OnChangeEvent<HTMLButtonElement>) => void;
};
