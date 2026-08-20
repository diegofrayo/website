import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import cn from "@diegofrayo-pkg/cn";
import { useIsMounted } from "@diegofrayo-pkg/hooks";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { getScrollPosition, setScrollPosition } from "@diegofrayo-pkg/utilities/browser/scrolling";

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
	// --- HOOKS ---
	const isMounted = useIsMounted();

	// --- STATE & REFS ---
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

	if (!isMounted) return null;

	return createPortal(
		<dialog
			ref={dialogRef}
			className={cn(
				"dr-modal",
				"fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none",
				"backdrop:bg-black/50",
				"bg-transparent p-0",
				"open:flex open:items-center open:justify-center",
			)}
			onClose={onCloseHandler}
			onClick={handleBackdropClick}
		>
			<div className={className}>{children}</div>
		</dialog>,
		document.body,
	);
}

export default Modal;
