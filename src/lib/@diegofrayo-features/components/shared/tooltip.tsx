import { Tooltip as RadixTooltip } from "radix-ui";

import type ReactTypes from "@diegofrayo-pkg/types/react";

type TooltipProps = {
	children: ReactTypes.Children;
	text: string;
	triggerAsChild?: boolean;
};

function Tooltip({ children, text, triggerAsChild = true }: TooltipProps) {
	return (
		<RadixTooltip.Root>
			<RadixTooltip.Trigger asChild={triggerAsChild}>{children}</RadixTooltip.Trigger>
			<RadixTooltip.Portal>
				<RadixTooltip.Content
					className="radix-tooltip-content rounded-md bg-black px-2 py-0.5 text-xs font-bold text-white shadow-md"
					sideOffset={5}
				>
					{text}
					<RadixTooltip.Arrow className="fill-black" />
				</RadixTooltip.Content>
			</RadixTooltip.Portal>
		</RadixTooltip.Root>
	);
}

export default Tooltip;
