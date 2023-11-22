import * as React from "react";
import cn from "classnames";

import { useDidMount, useToggleBodyScroll } from "~/hooks";
import type DR from "@diegofrayo/types";
import { getScrollPosition, setScrollPosition } from "@diegofrayo/utils/browser";
import v from "@diegofrayo/v";

type T_ModalProps = {
	children: DR.React.Children;
	visible: boolean;
	className?: string;
	onCloseHandler: () => void;
};

function Modal({ children, className, visible, onCloseHandler }: T_ModalProps) {
	// --- HOOKS ---
	useToggleBodyScroll(visible);

	if (visible) {
		return (
			<Backdrop
				className={className}
				onCloseHandler={onCloseHandler}
			>
				{children}
			</Backdrop>
		);
	}

	return null;
}

export default Modal;

// --- COMPONENTS ---

type T_BackdropProps = Pick<T_ModalProps, "children" | "onCloseHandler"> & {
	className: T_ModalProps["className"];
};

function Backdrop({ children, className, onCloseHandler }: T_BackdropProps) {
	// --- STATES & REFS ---
	const dialogRef = React.useRef<HTMLDialogElement>(null);
	const scrollPosition = React.useRef(0);

	// --- EFFECTS ---
	useDidMount(() => {
		if (v.isNull(dialogRef.current) || v.isTrue(dialogRef.current.open)) {
			return;
		}

		scrollPosition.current = getScrollPosition();
		dialogRef.current.showModal();
		dialogRef.current.addEventListener("close", () => {
			onCloseHandler();
			setScrollPosition(scrollPosition.current, "auto");
		});
	});

	return (
		<dialog
			className={cn(
				"tw-max-h-full tw-max-w-full tw-bg-transparent tw-p-3 dr-text-color-surface-600 backdrop:tw-fixed backdrop:tw-inset-0 backdrop:tw-bottom-0 backdrop:tw-z-50 backdrop:tw-m-0 backdrop:tw-flex backdrop:tw-cursor-default backdrop:tw-items-center backdrop:tw-justify-center backdrop:tw-overflow-hidden backdrop:tw-bg-black/50 backdrop:tw-p-0 sm:tw-p-6",
				className,
			)}
			ref={dialogRef}
		>
			{children}
		</dialog>
	);
}
