import { Tooltip as BaseUITooltip } from "@base-ui/react/tooltip";

import type ReactTypes from "@diegofrayo-pkg/types/react";

type TooltipProps = {
	children: ReactTypes.JSXElement;
	text: string;
	triggerAsChild?: boolean;
};

function Tooltip({ children, text, triggerAsChild }: TooltipProps) {
	return (
		<BaseUITooltip.Root>
			{triggerAsChild ? (
				<BaseUITooltip.Trigger render={children} />
			) : (
				<BaseUITooltip.Trigger>{children}</BaseUITooltip.Trigger>
			)}

			<BaseUITooltip.Portal>
				<BaseUITooltip.Positioner
					className="rounded-md bg-black px-2 py-1 text-xs font-bold text-white shadow-md"
					sideOffset={5}
				>
					<BaseUITooltip.Popup>
						{text}
						<BaseUITooltip.Arrow className="top-full">
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

type ArrowSvgProps = {
	size?: string;
	color?: string;
	className?: string;
};

const ArrowSvg = ({ size = "w-6 h-6", color = "text-black", className = "" }: ArrowSvgProps) => {
	return (
		<svg
			viewBox="0 0 100 100"
			className={`fill-current ${size} ${color} ${className}`}
			xmlns="http://www.w3.org/2000/svg"
		>
			<polygon points="0,0 100,0 50,70" />
		</svg>
	);
};
