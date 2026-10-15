import { cloneElement, isValidElement, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isBoolean, isNonEmptyString, isString } from "@diegofrayo-pkg/validator";

import Box from "./box";
import InlineText from "./inline-text";
import Title, { TitleVariants } from "./title";

// --- PROPS & TYPES ---

type CollapsibleProps = Omit<ReactTypes.DOM.HTMLElementAttributes["details"], "title"> & {
	contentClassName?: string;
	opened?: boolean;
	openedByDefault?: boolean;
	showIcon?: boolean;
	title?: string | ReactTypes.JSXElement;
	titleClassName?: string;
	onHideContentHandler?: () => void;
	onShowContentHandler?: () => void;
};

type CustomTitleProps = {
	className?: string;
};

// --- COMPONENT DEFINITION ---

function Collapsible({
	children,
	className = "",
	contentClassName = "",
	opened,
	openedByDefault = false,
	showIcon = true,
	title = "",
	titleClassName = "",
	onHideContentHandler,
	onShowContentHandler,
}: CollapsibleProps): ReactTypes.JSXElement {
	// --- STATES & REFS ---
	const [isOpenInternal, setIsOpenInternal] = useState(openedByDefault);

	// --- COMPUTED STATES ---
	const isControlled = isBoolean(opened);
	const isOpen = isControlled ? opened : isOpenInternal;
	const hasIndentedContent = isString(title) && showIcon;

	// --- STYLES ---
	const classes = {
		container: cn("dr-collapsible", className),
		content: cn(hasIndentedContent && "pl-5", contentClassName),
	};

	// --- HANDLERS ---
	function handleTitleToggle(): void {
		const newIsOpen = !isOpen;

		if (isControlled === false) {
			setIsOpenInternal(newIsOpen);
		}

		if (newIsOpen) {
			onShowContentHandler?.();
		} else {
			onHideContentHandler?.();
		}
	}

	return (
		<Box
			as="section"
			className={classes.container}
		>
			<CollapsibleTitle
				isOpen={isOpen}
				showIcon={showIcon}
				title={title}
				titleClassName={titleClassName}
				onToggle={handleTitleToggle}
			/>
			{isOpen && <Box className={classes.content}>{children}</Box>}
		</Box>
	);
}

export default Collapsible;

// --- COMPONENTS ---

type CollapsibleTitleProps = {
	isOpen: boolean;
	showIcon: boolean;
	title: string | ReactTypes.JSXElement;
	titleClassName: string;
	onToggle: () => void;
};

function CollapsibleTitle({
	isOpen,
	showIcon,
	title,
	titleClassName,
	onToggle,
}: CollapsibleTitleProps): ReactTypes.JSXElement {
	// --- COMPUTED STATES ---
	const isCustomTitle = isValidElement<CustomTitleProps>(title);
	const computedTitle = isNonEmptyString(title) ? title : isOpen ? "Hide" : "Show";

	// --- STYLES ---
	const classes = {
		title: cn("flex cursor-pointer items-start font-bold", titleClassName),
		customTitle: cn("cursor-pointer", isCustomTitle && title.props.className, titleClassName),
		icon: cn("relative top-1 mr-2 text-xs", isOpen && "rotate-90"),
	};

	// --- HANDLERS ---
	function handleTitleClick(event: ReactTypes.Events.OnClickEvent<HTMLElement>): void {
		event.stopPropagation();
		onToggle();
	}

	function handleTitleKeyDown(event: ReactTypes.Events.OnKeyDownEvent<HTMLElement>): void {
		if (event.key !== "Enter" && event.key !== " ") return;

		event.preventDefault();
		event.stopPropagation();
		onToggle();
	}

	if (isCustomTitle) {
		return cloneElement(title as ReactTypes.JSXElement, {
			role: "button",
			tabIndex: 0,
			className: classes.customTitle,
			"data-opened": isOpen,
			onClick: handleTitleClick,
			onKeyDown: handleTitleKeyDown,
		});
	}

	return (
		<Title
			variant={TitleVariants.UNSTYLED}
			as="h2"
			role="button"
			tabIndex={0}
			className={classes.title}
			onClick={handleTitleClick}
			onKeyDown={handleTitleKeyDown}
		>
			{showIcon && <InlineText className={classes.icon}>&#9654;</InlineText>}
			<InlineText>{computedTitle}</InlineText>
		</Title>
	);
}
