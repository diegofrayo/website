import * as React from "react";
import classNames from "classnames";

import { Button, Block } from "~/components/primitive";
import type { T_ReactElement, T_ReactFunctionComponent, T_ReactRefObject } from "~/types";

import SourceCode, { T_SourceCodeProps } from "./SourceCode";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_PlaygroundProps = Pick<T_SourceCodeProps, "code" | "language"> & {
	Component: T_ReactFunctionComponent;
};

function Playground(props: T_PlaygroundProps): T_ReactElement {
	const {
		// props
		Component,
		code,
		language,

		// states & refs
		contentRef,

		// vars
		isSourceCodeTabSelected,
		isOutputTabSelected,

		// handlers
		handleTabClick,
	} = useController(props);

	return (
		<div
			className="dfr-Playground root tw-flex tw-flex-col tw-border-4 tw-border-black dfr-bg-color-light-strong dark:dfr-bg-color-primary dark:dfr-border-color-primary"
			data-markdown-block
		>
			<Block
				className="tab-content-container tw-flex-1 tw-overflow-auto tw-p-0.5"
				ref={contentRef}
			>
				{isSourceCodeTabSelected ? (
					<SourceCode
						language={language}
						code={code}
						displaySourceCodeDetails={false}
					/>
				) : (
					<Component />
				)}
			</Block>
			<Block className="tw-flex-no-wrap tw-flex tw-border-t-4 tw-text-sm dfr-border-color-dark-strong dark:dfr-border-color-primary">
				<Button
					variant={Button.variant.SIMPLE}
					className={classNames(
						"tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
						isSourceCodeTabSelected &&
							"tw-font-bold tw-text-white dfr-bg-color-dark-strong hover:tw-opacity-100 dark:tw-bg-gray-500 dark:tw-text-white",
					)}
					onClick={handleTabClick(0)}
				>
					Source code
				</Button>
				<Button
					variant={Button.variant.SIMPLE}
					className={classNames(
						"tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
						isOutputTabSelected &&
							"tw-font-bold tw-text-white dfr-bg-color-dark-strong hover:tw-opacity-100 dark:tw-bg-gray-500 dark:tw-text-white",
					)}
					onClick={handleTabClick(1)}
				>
					Output
				</Button>
			</Block>

			<style jsx>
				{`
					.root {
						min-height: 200px;
					}

					.root :global(.tab-content-container) {
						max-height: 300px;
					}

					.root :global(.dfr-Code) {
						box-shadow: none;
						margin: 0;
					}
				`}
			</style>
		</div>
	);
}

export default Playground;

// --- Controller ---

type T_UseControllerReturn = T_PlaygroundProps & {
	isSourceCodeTabSelected: boolean;
	isOutputTabSelected: boolean;
	handleTabClick: (index: 0 | 1) => () => void;
	contentRef: T_ReactRefObject<HTMLDivElement>;
};

function useController(props: T_PlaygroundProps): T_UseControllerReturn {
	// states & refs
	const [tab, setTab] = React.useState(0);
	const contentRef = React.useRef<HTMLDivElement>(null);

	// handlers
	const handleTabClick: T_UseControllerReturn["handleTabClick"] = function handleTabClick(index) {
		return () => {
			setTab(index);

			if (contentRef.current) {
				contentRef.current.scrollTop = 0;
			}
		};
	};

	return {
		// props
		...props,

		// states & refs
		contentRef,

		// vars
		isSourceCodeTabSelected: tab === 0,
		isOutputTabSelected: tab === 1,

		// handlers
		handleTabClick,
	};
}
