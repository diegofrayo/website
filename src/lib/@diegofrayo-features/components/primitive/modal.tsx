import { useRef } from "react";

import cn from "@diegofrayo-pkg/cn";
import { useDidMount, useLockScroll } from "@diegofrayo-pkg/hooks";
import type DR from "@diegofrayo-pkg/types";
import { getScrollPosition, setScrollPosition } from "@diegofrayo-pkg/utilities/browser";
import { isNull, isTrue } from "@diegofrayo-pkg/validator";

// --- PROPS & TYPES ---

type ModalProps = {
	children: DR.React.Children;
	className?: string;
	visible: boolean;
	onCloseHandler: () => void;
};

// --- COMPONENT DEFINITION ---

function Modal({ children, className, visible, onCloseHandler }: ModalProps) {
	// --- HOOKS ---
	useLockScroll(visible);

	if (!visible) return null;

	return (
		<Backdrop
			className={className}
			onCloseHandler={onCloseHandler}
		>
			{children}
		</Backdrop>
	);
}

export default Modal;

// --- COMPONENTS ---

type BackdropProps = Pick<ModalProps, "children" | "onCloseHandler"> & {
	className: ModalProps["className"];
};

function Backdrop({ children, className, onCloseHandler }: BackdropProps) {
	// --- STATE & REFS ---
	const dialogRef = useRef<HTMLDialogElement>(null);
	const scrollPosition = useRef(0);

	// --- HANDLERS ---
	function handleClick(event: DR.React.Events.OnMouseEvent<HTMLDialogElement>) {
		if (event.target !== dialogRef.current) return;

		onCloseHandler();
		setScrollPosition(scrollPosition.current, "auto");
	}

	// --- EFFECTS ---
	useDidMount(() => {
		if (isNull(dialogRef.current) || isTrue(dialogRef.current.open)) return;

		scrollPosition.current = getScrollPosition();
		dialogRef.current.showModal();
		dialogRef.current.addEventListener("close", () => {
			onCloseHandler();
			setScrollPosition(scrollPosition.current, "auto");
		});
	});

	return (
		<dialog
			ref={dialogRef}
			className={cn(
				"m-auto max-h-full max-w-full bg-transparent p-3 text-zinc-400 backdrop:fixed backdrop:inset-0 backdrop:bottom-0 backdrop:z-50 backdrop:m-0 backdrop:flex backdrop:size-full backdrop:cursor-default backdrop:items-center backdrop:justify-center backdrop:overflow-hidden backdrop:bg-black/70 backdrop:p-0 sm:p-6",
				className,
			)}
			onClick={handleClick}
		>
			{children}
		</dialog>
	);
}
