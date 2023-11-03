import * as React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import cn from "classnames";

import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";

type T_PopoverProps = {
	children: DR.React.Children;
	text: string;
	open?: boolean;
};

function Popover({ children, text, open }: T_PopoverProps) {
	return (
		<RadixPopover.Root {...(v.isBoolean(open) ? { open } : {})}>
			<RadixPopover.Trigger
				className="radix-popover-trigger"
				asChild
			>
				{children}
			</RadixPopover.Trigger>
			<RadixPopover.Portal>
				<RadixPopover.Content
					className={cn(
						"radix-popover-content",
						"tw-rounded-md tw-border tw-border-dotted tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white dr-bg-color-surface-200 dr-border-color-surface-300",
					)}
					side="top"
				>
					{text}
					<RadixPopover.Arrow className="tw-fill-[var(--dr-color-surface-300)]" />
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	);
}

export default Popover;
