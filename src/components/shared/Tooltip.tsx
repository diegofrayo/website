import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import type DR from "@diegofrayo/types";

// --- PROPS & TYPES ---

type T_TooltipProps = {
	children: DR.React.Children;
	text: string;
	triggerAsChild?: boolean;
};

function Tooltip({ children, text, triggerAsChild = true }: T_TooltipProps) {
	return (
		<RadixTooltip.Root>
			<RadixTooltip.Trigger asChild={triggerAsChild}>{children}</RadixTooltip.Trigger>
			<RadixTooltip.Portal>
				<RadixTooltip.Content
					className="radix-tooltip-content tw-rounded-md tw-border tw-border-dotted tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white dr-bg-color-surface-200 dr-border-color-surface-300"
					sideOffset={5}
				>
					{text}
					<RadixTooltip.Arrow className="tw-fill-[var(--dr-color-surface-200)]" />
				</RadixTooltip.Content>
			</RadixTooltip.Portal>
		</RadixTooltip.Root>
	);
}

export default Tooltip;
