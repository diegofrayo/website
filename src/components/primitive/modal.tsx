import { Dialog } from "@base-ui/react/dialog";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

// --- PROPS & TYPES ---

type ModalProps = {
	children: ReactTypes.Children;
	className?: string;
	visible: boolean;
	onOpenHandler?: () => void;
	onCloseHandler: () => void;
};

// --- COMPONENT DEFINITION ---

function Modal({
	children,
	className,
	visible,
	onCloseHandler,
	onOpenHandler,
}: ModalProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		backdrop:
			"fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200 data-open:opacity-100 data-closed:opacity-0 data-starting-style:opacity-0",
		viewport: "fixed inset-0 z-50 flex items-center justify-center",
		popup: cn(
			"transition-all duration-200",
			"data-open:scale-100 data-open:opacity-100",
			"data-closed:scale-95 data-closed:opacity-0",
			"data-starting-style:scale-95 data-starting-style:opacity-0",
			className,
		),
	};

	// --- HANDLERS ---
	function handleOpenChange(open: boolean): void {
		if (open) {
			onOpenHandler?.();
		} else {
			onCloseHandler();
		}
	}

	return (
		<Dialog.Root
			open={visible}
			onOpenChange={handleOpenChange}
		>
			<Dialog.Portal>
				<Dialog.Backdrop className={classes.backdrop} />
				<Dialog.Viewport className={classes.viewport}>
					<Dialog.Popup className={classes.popup}>{children}</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default Modal;
