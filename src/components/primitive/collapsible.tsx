import { cloneElement, isValidElement, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isBoolean, isNonEmptyString, isString } from "@diegofrayo-pkg/validator";

import Box from "./box";
import InlineText from "./inline-text";
import Title, { TitleVariant } from "./title";

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
	function handleTitleClick(event: ReactTypes.Events.OnClickEvent<HTMLElement>): void {
		event.stopPropagation();

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
				onClick={handleTitleClick}
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
	onClick: (event: ReactTypes.Events.OnClickEvent<HTMLElement>) => void;
};

function CollapsibleTitle({
	isOpen,
	showIcon,
	title,
	titleClassName,
	onClick,
}: CollapsibleTitleProps): ReactTypes.JSXElement {
	// --- COMPUTED STATES ---
	const computedTitle = isNonEmptyString(title) ? title : isOpen ? "Hide" : "Show";

	// --- STYLES ---
	const classes = {
		title: cn("flex cursor-pointer items-start font-bold", titleClassName),
		icon: cn("relative top-1 mr-2 text-xs", isOpen && "rotate-90"),
	};

	if (isValidElement<CustomTitleProps>(title)) {
		return cloneElement(title as ReactTypes.JSXElement, {
			onClick,
			role: "button",
			className: cn("cursor-pointer", title.props.className, titleClassName),
			opened: isOpen,
		});
	}

	return (
		<Title
			variant={TitleVariant.UNSTYLED}
			as="h2"
			role="button"
			className={classes.title}
			onClick={onClick}
		>
			{showIcon && <InlineText className={classes.icon}>&#9654;</InlineText>}
			<InlineText>{computedTitle}</InlineText>
		</Title>
	);
}
