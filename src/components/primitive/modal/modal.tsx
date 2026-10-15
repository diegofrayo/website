import { Dialog } from "@base-ui/react/dialog";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";

import { modalStyles } from "./modal.styles";

// --- PROPS & TYPES ---

type ModalProps = {
	children: ReactTypes.Children;
	visible: boolean;
	className?: string;
	onCloseHandler: () => void;
	onOpenHandler?: () => void;
};

// --- COMPONENT DEFINITION ---

function Modal({
	children,
	visible,
	className,
	onCloseHandler,
	onOpenHandler,
}: ModalProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		backdrop: cn(
			"dr-modal__backdrop",
			"fixed inset-0 z-50 transition-opacity duration-200",
			"data-closed:opacity-0 data-open:opacity-100 data-starting-style:opacity-0",
			modalStyles.backdrop,
		),
		viewport: cn("fixed inset-0 z-50 flex w-full items-center justify-center", modalStyles.viewport),
		popup: cn(
			"dr-modal",
			"transition-all duration-200",
			"data-open:scale-100 data-open:opacity-100",
			"data-closed:scale-95 data-closed:opacity-0",
			"data-starting-style:scale-95 data-starting-style:opacity-0",
			modalStyles.popup,
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
				<Dialog.Backdrop
					className={classes.backdrop}
					forceRender
				/>
				<Dialog.Viewport className={classes.viewport}>
					<Dialog.Popup className={classes.popup}>{children}</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default Modal;
