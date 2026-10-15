import { Children, cloneElement, isValidElement, useState } from "react";
import type { PopoverPositionerProps } from "@base-ui/react/popover";

import type ReactTypes from "@diegofrayo-pkg/types/react";
import { copyToClipboard } from "@diegofrayo-pkg/utilities/browser/clipboard";
import { isFunction, isString } from "@diegofrayo-pkg/validator";

import { Box } from "~/components/primitive";

import Popover from "./popover";

export type CopyToClipboardPopoverProps = PopoverPositionerProps & {
	textToCopy: string | (() => string);

	popoverInnerWrapperClassName?: string;
	popoverText?: string;
};

function CopyToClipboardPopover({
	children,
	textToCopy,
	popoverInnerWrapperClassName,
	popoverText = "copied!",
	...rest
}: CopyToClipboardPopoverProps): ReactTypes.JSXElement {
	// --- STATES & REFS ---
	const [showPopover, setShowPopover] = useState(false);

	// --- HANDLERS ---
	function handleChildClick(childOnClick: ChildElementProps["onClick"]): ChildClickHandler {
		return function handleClick(event) {
			copyText();

			if (isFunction(childOnClick)) {
				childOnClick(event);
			}
		};
	}

	// --- UTILS ---
	function copyText(): void {
		void copyToClipboard(isString(textToCopy) ? textToCopy : textToCopy());

		if (showPopover) {
			return;
		}

		setShowPopover(true);
		setTimeout(function hidePopover() {
			setShowPopover(false);
		}, 2000);
	}

	function renderChild(child: ReactTypes.Children): ReactTypes.JSXElementNullable {
		if (isValidElement<ChildElementProps>(child)) {
			return cloneElement(child, { onClick: handleChildClick(child.props.onClick) });
		}

		return null;
	}

	return (
		<Popover
			text={popoverText}
			open={showPopover}
			nativeButton={false}
			{...rest}
		>
			<Box
				as="span"
				className={popoverInnerWrapperClassName}
			>
				{Children.map(children, renderChild)}
			</Box>
		</Popover>
	);
}

export default CopyToClipboardPopover;

// --- TYPES ---

type ChildClickHandler = (event: ReactTypes.Events.OnClickEvent<HTMLButtonElement>) => void;

type ChildElementProps = {
	onClick?: ChildClickHandler;
};
