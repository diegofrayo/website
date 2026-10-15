import { Tooltip as BaseUITooltip } from "@base-ui/react/tooltip";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import ArrowSvg from "./arrow-svg";

type TooltipProps = {
	children: ReactTypes.JSXElement;
	text: string;

	triggerAsChild?: boolean;
};

function Tooltip({ children, text, triggerAsChild = false }: TooltipProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		positioner: cn("rounded-md bg-black px-2 py-1 text-xs font-bold text-white shadow-md"),
		arrow: cn("top-full"),
	};

	return (
		<BaseUITooltip.Root>
			<TooltipTrigger asChild={triggerAsChild}>{children}</TooltipTrigger>

			<BaseUITooltip.Portal>
				<BaseUITooltip.Positioner
					className={classes.positioner}
					sideOffset={5}
				>
					<BaseUITooltip.Popup>
						{text}
						<BaseUITooltip.Arrow className={classes.arrow}>
							<ArrowSvg
								size="size-1.5"
								color="text-black"
							/>
						</BaseUITooltip.Arrow>
					</BaseUITooltip.Popup>
				</BaseUITooltip.Positioner>
			</BaseUITooltip.Portal>
		</BaseUITooltip.Root>
	);
}

export default Tooltip;

// --- COMPONENTS ---

type TooltipTriggerProps = {
	asChild: boolean;
	children: ReactTypes.JSXElement;
};

function TooltipTrigger({ asChild, children }: TooltipTriggerProps): ReactTypes.JSXElement {
	if (asChild) {
		return <BaseUITooltip.Trigger render={children} />;
	}

	return <BaseUITooltip.Trigger>{children}</BaseUITooltip.Trigger>;
}
