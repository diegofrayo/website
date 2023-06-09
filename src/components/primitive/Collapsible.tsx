import * as React from "react";
import classNames from "classnames";

import v from "~/lib/v";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

import Block from "./Block";
import InlineText from "./InlineText";
import Title from "./Title";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_CollapsibleProps = T_HTMLElementAttributes["details"] & {
	title?: string;
	openedByDefault?: boolean;
	opened?: boolean;
	contentClassName?: string;

	onShowContentHandler?: () => void;
	onHideContentHandler?: () => void;
};

function Collapsible(props: T_CollapsibleProps): T_ReactElement {
	const {
		// --- PROPS ---
		children,
		className,
		contentClassName,

		// --- STATES & REFS ---
		isOpen,

		// --- VARS ---
		computedTitle,

		// --- HANDLERS ---
		handleToggleClick,
	} = useController(props);

	return (
		<Block
			className={className}
			is="section"
		>
			<Title
				variant={Title.variant.UNSTYLED}
				is="h2"
				role="button"
				className="tw-flex tw-items-center tw-font-bold dfr-text-color-bw"
				onClick={handleToggleClick}
			>
				<InlineText
					className={classNames("tw-mr-2 tw-transform tw-text-sm", isOpen && "tw-rotate-90")}
				>
					&#9654;
				</InlineText>
				<InlineText>{computedTitle}</InlineText>
			</Title>
			<Block
				className={classNames(
					"tw-mt-2 tw-pl-5",
					contentClassName,
					isOpen ? "tw-block" : "tw-hidden",
				)}
			>
				{children}
			</Block>
		</Block>
	);
}

export default Collapsible;

// --- CONTROLLER ---

type T_UseControllerReturn = Pick<
	T_CollapsibleProps,
	"children" | "className" | "contentClassName"
> & {
	computedTitle: string;
	handleToggleClick: () => void;
	isOpen: boolean;
};

function useController({
	children,
	title = "",
	openedByDefault = false,
	opened,
	className = "",
	contentClassName = "",
	onShowContentHandler = (): void => undefined,
	onHideContentHandler = (): void => undefined,
}: T_CollapsibleProps): T_UseControllerReturn {
	// --- STATES & REFS ---
	const [isOpen, setIsOpen] = React.useState(openedByDefault);

	// --- EFFECTS ---
	React.useEffect(() => {
		if (v.isBoolean(opened)) {
			setIsOpen(opened);
		}
	}, [opened]);

	React.useEffect(() => {
		if (isOpen) {
			onShowContentHandler();
		} else {
			onHideContentHandler();
		}
	}, [isOpen, onShowContentHandler, onHideContentHandler]);

	return {
		// --- PROPS ---
		children,
		className,
		contentClassName,

		// --- STATES & REFS ---
		isOpen,

		// --- VARS ---
		computedTitle: v.isNotEmptyString(title) ? title : isOpen ? "Hide" : "Show",

		// --- HANDLERS ---
		handleToggleClick: () => setIsOpen((currentValue) => !currentValue),
	};
}
