import * as React from "react";
import classNames from "classnames";

import v from "~/@legacy/src/lib/v";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/@legacy/src/types";

import Block from "./Block";
import InlineText from "./InlineText";
import Title from "./Title";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_CollapsibleProps = T_HTMLElementAttributes["details"] & {
	title?: string;
	openedByDefault?: boolean;
	opened?: boolean;

	onShowContentHandler?: () => void;
	onHideContentHandler?: () => void;
};

function Collapsible(props: T_CollapsibleProps): T_ReactElement {
	const {
		// props
		children,
		className,

		// states & refs
		isOpen,

		// vars
		computedTitle,

		// handlers
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
			<Block className={classNames("tw-mt-2 tw-pl-5", isOpen ? "tw-block" : "tw-hidden")}>
				{children}
			</Block>
		</Block>
	);
}

export default Collapsible;

// --- Controller ---

type T_UseControllerReturn = Pick<T_CollapsibleProps, "children" | "className"> & {
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
	onShowContentHandler = (): void => undefined,
	onHideContentHandler = (): void => undefined,
}: T_CollapsibleProps): T_UseControllerReturn {
	// states & refs
	const [isOpen, setIsOpen] = React.useState(openedByDefault);

	// effects
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
		// props
		children,
		className,

		// states & refs
		isOpen,

		// vars
		computedTitle: v.isNotEmptyString(title) ? title : isOpen ? "Hide" : "Show",

		// handlers
		handleToggleClick: () => setIsOpen((currentValue) => !currentValue),
	};
}
