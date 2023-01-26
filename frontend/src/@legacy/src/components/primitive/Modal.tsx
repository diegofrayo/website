import * as React from "react";
import classNames from "classnames";

import { useDidMount, useToggleBodyScroll } from "~/@legacy/src/hooks";
import v from "~/@legacy/src/lib/v";
import { getScrollPosition, setScrollPosition } from "~/@legacy/src/utils/browser";
import type { T_ReactChildren, T_ReactElement, T_ReactElementNullable } from "~/@legacy/src/types";

type T_ModalProps = {
	children: T_ReactChildren;
	visible: boolean;
	className?: string;
	onCloseHandler: () => void;
};

function Modal({
	children,
	className,
	visible,
	onCloseHandler,
}: T_ModalProps): T_ReactElementNullable {
	// hooks
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

// --- Components ---

type T_BackdropProps = Pick<T_ModalProps, "children" | "onCloseHandler"> & {
	className: T_ModalProps["className"];
};

function Backdrop({ children, className, onCloseHandler }: T_BackdropProps): T_ReactElement {
	// states & refs
	const dialogRef = React.useRef<HTMLDialogElement>(null);
	const scrollPosition = React.useRef(0);

	// effects
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
			className={classNames("tw-p-3 sm:tw-p-6", className)}
			ref={dialogRef}
		>
			{children}

			<style jsx>
				{`
					dialog {
						background-color: transparent;
						max-height: 100%;
						max-width: 100%;
					}

					dialog::backdrop {
						align-items: center;
						background-color: rgba(0, 0, 0, 0.5);
						bottom: 0;
						cursor: default;
						display: flex;
						justify-content: center;
						left: 0;
						overflow: hidden;
						margin: 0;
						padding: 0;
						position: fixed;
						right: 0;
						top: 0;
						z-index: 999;
					}
				`}
			</style>
		</dialog>
	);
}
