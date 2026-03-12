import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { isBoolean, isNotEmptyString } from "@diegofrayo-pkg/validator";

import Box from "./box";
import InlineText from "./inline-text";
import Title from "./title";

// --- PROPS & TYPES ---

type CollapsibleProps = Omit<DR.DOM.HTMLElementAttributes["details"], "title"> & {
	contentClassName?: string;
	onHideContentHandler?: () => void;
	onShowContentHandler?: () => void;
	opened?: boolean;
	openedByDefault?: boolean;
	showIcon?: boolean;
	title?: string | DR.React.JSXElement;
	titleClassName?: string;
};

// --- COMPONENT DEFINITION ---

function Collapsible({
	children,
	className = "",
	contentClassName = "",
	onHideContentHandler = () => undefined,
	onShowContentHandler = () => undefined,
	opened,
	openedByDefault = false,
	showIcon = true,
	title = "",
	titleClassName = "",
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
				// eslint-disable-next-line react-hooks/refs
				cloneElement(title as DR.React.JSXElement, {
					className: cn("cursor-pointer", title.props.className),
					onClick: handleToggleClick,
					role: "button",
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
