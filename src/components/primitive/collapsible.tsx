import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isBoolean, isNotEmptyString } from "@diegofrayo-pkg/validator";

import Box from "./box";
import InlineText from "./inline-text";
import Title from "./title";

// --- PROPS & TYPES ---

type CollapsibleProps = Omit<ReactTypes.DOM.HTMLElementAttributes["details"], "title"> & {
	title?: string | ReactTypes.JSXElement;
	openedByDefault?: boolean;
	opened?: boolean;
	contentClassName?: string;
	titleClassName?: string;
	showIcon?: boolean;
	onShowContentHandler?: () => void;
	onHideContentHandler?: () => void;
};

// --- COMPONENT DEFINITION ---

function Collapsible({
	children,
	openedByDefault = false,
	opened,
	className = "",
	contentClassName = "",
	titleClassName = "",
	title = "",
	showIcon = true,
	onShowContentHandler = () => undefined,
	onHideContentHandler = () => undefined,
}: CollapsibleProps) {
	// --- STATE & REFS ---
	const [isOpen, setIsOpen] = useState(openedByDefault);
	const touchedRef = useRef(false);

	// --- COMPUTED STATES ---
	const computedTitle = isNotEmptyString(title) ? title : isOpen ? "Hide" : "Show";

	// --- EFFECTS ---
	useEffect(
		function setInitialIsOpenValueFromProps() {
			if (isBoolean(opened)) {
				setIsOpen(opened);
			}
		},
		[opened],
	);

	useEffect(
		function onOpenChange() {
			if (touchedRef.current === false) return;

			if (isOpen) {
				onShowContentHandler();
			} else {
				onHideContentHandler();
			}
		},
		[isOpen, onShowContentHandler, onHideContentHandler],
	);

	// --- HANDLERS ---
	function handleToggleClick() {
		touchedRef.current = true;
		setIsOpen((currentValue) => !currentValue);
	}

	return (
		<Box
			as="section"
			className={cn("dr-collapsible", className)}
		>
			{isValidElement<CustomTitleProps>(title) ? (
				// TODO: [react] Fix me
				// eslint-disable-next-line react-hooks/refs
				cloneElement(title as ReactTypes.JSXElement, {
					onClick: handleToggleClick,
					role: "button",
					className: cn("cursor-pointer", title.props.className),
				})
			) : (
				<Title
					variant={Title.variant.UNSTYLED}
					as="h2"
					role="button"
					className={cn("flex cursor-pointer items-start font-bold", titleClassName)}
					onClick={handleToggleClick}
				>
					{showIcon ? (
						<InlineText
							className={cn(
								"relative top-0.5 mr-2 transform text-xs",
								isOpen ? "top-1 rotate-90" : "top-1",
							)}
						>
							&#9654;
						</InlineText>
					) : null}
					<InlineText>{computedTitle}</InlineText>
				</Title>
			)}
			<Box className={cn(showIcon && "pl-5", contentClassName, isOpen ? "block" : "hidden")}>
				{children}
			</Box>
		</Box>
	);
}

export default Collapsible;

// --- TYPES ---

type CustomTitleProps = {
	className?: string;
};
