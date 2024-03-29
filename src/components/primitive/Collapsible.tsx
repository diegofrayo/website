import * as React from "react";
import cn from "classnames";

import type DR from "@diegofrayo/types";
import v from "@diegofrayo/v";

import Block from "./Block";
import InlineText from "./InlineText";
import Title from "./Title";

// --- PROPS & TYPES ---

type T_CollapsibleProps = DR.DOM.HTMLElementAttributes["details"] & {
	title?: string;
	openedByDefault?: boolean;
	opened?: boolean;
	contentClassName?: string;
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
	title = "",
	showIcon = true,
	onShowContentHandler = () => undefined,
	onHideContentHandler = () => undefined,
}: T_CollapsibleProps) {
	// --- STATES & REFS ---
	const [isOpen, setIsOpen] = React.useState(openedByDefault);
	const touchedRef = React.useRef(false);

	// --- VARS ---
	const computedTitle = v.isNotEmptyString(title) ? title : isOpen ? "Hide" : "Show";

	// --- EFFECTS ---
	React.useEffect(
		function setInitialIsOpenValueFromProps() {
			if (v.isBoolean(opened)) {
				setIsOpen(opened);
			}
		},
		[opened],
	);

	React.useEffect(
		function onOpenChange() {
			if (touchedRef.current === false) return;

			if (isOpen) {
				onShowContentHandler();
			} else {
				onHideContentHandler();
			}
		},
		[isOpen, onShowContentHandler, onHideContentHandler, touchedRef],
	);

	// --- HANDLERS ---
	function handleToggleClick() {
		touchedRef.current = true;
		setIsOpen((currentValue) => !currentValue);
	}

	return (
		<Block
			className={cn("dr-collapsible", className)}
			is="section"
		>
			<Title
				variant={Title.variant.UNSTYLED}
				is="h2"
				role="button"
				className="tw-flex tw-items-start tw-font-bold"
				onClick={handleToggleClick}
			>
				{showIcon ? (
					<InlineText
						className={cn(
							"tw-relative tw-top-0.5 tw-mr-2 tw-transform tw-text-sm",
							isOpen ? "tw-top-1 tw-rotate-90" : "tw-top-0.5",
						)}
					>
						&#9654;
					</InlineText>
				) : null}
				<InlineText>{computedTitle}</InlineText>
			</Title>
			<Block
				className={cn(showIcon && "tw-pl-5", contentClassName, isOpen ? "tw-block" : "tw-hidden")}
			>
				{children}
			</Block>
		</Block>
	);
}

export default Collapsible;
