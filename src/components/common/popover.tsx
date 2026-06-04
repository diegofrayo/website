import {
	Popover as BaseUIPopover,
	type PopoverPositionerProps,
	type PopoverTriggerProps,
} from "@base-ui/react/popover";

import type ReactTypes from "@diegofrayo-pkg/types/react";

type PopoverProps = Partial<PopoverPositionerProps> &
	Partial<Pick<PopoverTriggerProps, "nativeButton">> & {
		children: ReactTypes.JSXElement;
		text: string;
		open?: boolean;
	};

function Popover({ children, text, open = false, ...rest }: PopoverProps) {
	return (
		<BaseUIPopover.Root open={open}>
			<BaseUIPopover.Trigger
				render={children}
				nativeButton={rest.nativeButton ?? true}
			/>
			<BaseUIPopover.Portal>
				<BaseUIPopover.Positioner
					className="rounded-md bg-zinc-700 px-2 py-0.5 text-xs font-bold text-zinc-200 shadow-sm shadow-zinc-400"
					side={rest.side || "top"}
					align={rest.align || "center"}
					sideOffset={8}
				>
					<BaseUIPopover.Popup>
						<BaseUIPopover.Description>{text}</BaseUIPopover.Description>
						<BaseUIPopover.Arrow>
							<ArrowSvg
								size="size-2.5"
								color="text-zinc-700"
							/>
						</BaseUIPopover.Arrow>
					</BaseUIPopover.Popup>
				</BaseUIPopover.Positioner>
			</BaseUIPopover.Portal>
		</BaseUIPopover.Root>
	);
}

export default Popover;

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
