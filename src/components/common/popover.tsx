import {
	Popover as BaseUIPopover,
	type PopoverPositionerProps,
	type PopoverTriggerProps,
} from "@base-ui/react/popover";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import ArrowSvg from "./arrow-svg";

type PopoverProps = Partial<PopoverPositionerProps> &
	Partial<Pick<PopoverTriggerProps, "nativeButton">> & {
		children: ReactTypes.JSXElement;
		text: string;

		open?: boolean;
	};

function Popover({
	children,
	text,
	align = "center",
	nativeButton = true,
	open = false,
	side = "top",
}: PopoverProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		positioner: cn(
			"rounded-md bg-zinc-700 px-2 py-0.5 text-xs font-bold text-zinc-200 shadow-sm shadow-zinc-400",
		),
	};

	return (
		<BaseUIPopover.Root open={open}>
			<BaseUIPopover.Trigger
				render={children}
				nativeButton={nativeButton}
			/>
			<BaseUIPopover.Portal>
				<BaseUIPopover.Positioner
					className={classes.positioner}
					side={side}
					align={align}
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
