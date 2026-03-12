import { Popover as RadixPopover } from "radix-ui";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";

type PopoverProps = {
	children: DR.React.Children;
	text: string;
	open?: boolean;
};

function Popover({ children, text, open = false }: PopoverProps) {
	return (
		<RadixPopover.Root open={open}>
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
						"rounded-md bg-zinc-700 px-2 py-0.5 text-xs font-bold text-zinc-200 shadow-sm shadow-zinc-400",
					)}
					side="top"
				>
					{text}
					<RadixPopover.Arrow className="fill-zinc-700" />
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	);
}

export default Popover;
