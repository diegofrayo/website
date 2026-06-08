import { useEffect, useRef } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { getScrollPosition, setScrollPosition } from "@diegofrayo-pkg/utilities/browser";

// --- PROPS & TYPES ---

type ModalProps = {
	children: ReactTypes.Children;
	className?: string;
	visible: boolean;
	onOpenHandler?: () => void;
	onCloseHandler: () => void;
};

// --- COMPONENT DEFINITION ---

function Modal({ children, visible, className, onCloseHandler, onOpenHandler }: ModalProps) {
	// --- REFS ---
	const dialogRef = useRef<HTMLDialogElement>(null);
	const scrollPosition = useRef(0);

	// --- EFFECTS ---
	useEffect(
		function syncDialogVisibility() {
			const dialog = dialogRef.current;

			if (!dialog) return;

			if (visible) {
				scrollPosition.current = getScrollPosition();
				dialog.showModal();
				onOpenHandler?.();
			} else {
				dialog.close();
			}
		},
		[visible, onOpenHandler],
	);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const callback = () => {
			onCloseHandler();
			setScrollPosition(scrollPosition.current, "auto");
		};

		dialog.addEventListener("close", callback);

		return () => {
			dialog.removeEventListener("close", callback);
		};
	}, [onCloseHandler]);

	// --- HANDLERS ---
	function handleBackdropClick(event: ReactTypes.Events.OnClickEvent<HTMLDialogElement>) {
		if (event.target === dialogRef.current) {
			onCloseHandler();
		}
	}

	return (
		<dialog
			ref={dialogRef}
			className={cn(
				"dr-modal",
				"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
				"backdrop:bg-black/50",
				"bg-transparent p-0",
				"open:flex open:items-center open:justify-center",
				className,
			)}
			onClose={onCloseHandler}
			onClick={handleBackdropClick}
		>
			{children}
		</dialog>
	);
}

export default Modal;
