import * as React from "react";
import classNames from "classnames";

import { Button, Block, Icon, Text } from "~/components/primitive";
import { ENV_VARS } from "~/constants";
import { createArray } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement, T_ReactFunctionComponent, T_ReactRef } from "~/types";

import SourceCode, { T_SourceCodeProps } from "./SourceCode";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_PlaygroundProps = Pick<T_SourceCodeProps, "code" | "language"> & {
	Component: T_ReactFunctionComponent;
	height?: number | "auto";
	tabsNames?: [string, string];
};

function Playground({
	height = "auto",
	tabsNames = ["", ""],
	...props
}: T_PlaygroundProps): T_ReactElement {
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
			className="dfr-Playground root tw-flex tw-min-h-[300px] tw-flex-col tw-border-4 dfr-border-color-gs-black dfr-bg-color-wb dark:dfr-border-color-primary"
			style={{ height }}
			data-markdown-block
		>
			<Block
				className="tw-relative tw-flex-1"
				ref={contentRef}
			>
				{isSourceCodeTabSelected ? (
					<Block className="tw-absolute tw-inset-2 tw-overflow-auto">
						<SourceCode
							height="tw-h-full"
							language={language}
							code={code}
						/>
					</Block>
				) : (
					<Block className="tw-absolute tw-inset-2 tw-flex tw-flex-col tw-rounded-md tw-border-4 tw-border-gray-200">
						<Block className="tw-flex tw-flex-nowrap tw-items-center tw-justify-between tw-bg-gray-200 tw-p-2">
							<Block className="tw-flex tw-items-center">
								{createArray(3).map((element) => {
									return (
										<Block
											key={generateSlug(`Playground-Block-element-${element}`)}
											className={classNames(
												"tw-mr-1.5 tw-inline-block tw-h-3 tw-w-3 tw-rounded-full last:tw-mr-0",
												{
													"tw-bg-red-500": element === 1,
													"tw-bg-yellow-500": element === 2,
													"tw-bg-green-500": element === 3,
												},
											)}
										/>
									);
								})}
							</Block>
							<Text className="tw-ml-4 tw-mr-3 tw-flex-1 tw-truncate tw-rounded-full tw-px-4 tw-py-1.5 tw-text-xs dfr-bg-color-gs-white dfr-text-color-gs-700">
								{ENV_VARS.NEXT_PUBLIC_WEBSITE_URL}
							</Text>
							<Block>
								<Icon
									color="dfr-text-color-secondary"
									size={28}
									icon={Icon.icon.MENU}
								/>
							</Block>
						</Block>
						<Block className="tw-flex-1 tw-overflow-auto tw-p-2 dfr-bg-color-gs-white">
							<Component />
						</Block>
					</Block>
				)}
			</Block>
			<Block className="tw-flex-no-wrap tw-flex tw-border-t-4 tw-text-sm dfr-border-color-gs-black dark:dfr-border-color-primary">
				<Button
					variant={Button.variant.SIMPLE}
					className={classNames(
						"tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
						isOutputTabSelected &&
							"tw-font-bold dfr-text-color-gs-white dfr-bg-color-bw hover:tw-opacity-100 dark:dfr-bg-color-tertiary",
					)}
					onClick={handleTabClick(0)}
				>
					{tabsNames[0] || "Preview"}
				</Button>
				<Button
					variant={Button.variant.SIMPLE}
					className={classNames(
						"tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
						isSourceCodeTabSelected &&
							"tw-font-bold dfr-text-color-gs-white dfr-bg-color-bw hover:tw-opacity-100 dark:dfr-bg-color-tertiary",
					)}
					onClick={handleTabClick(1)}
				>
					{tabsNames[1] || "Source code"}
				</Button>
			</Block>

			<style jsx>{`
				.root :global(.dfr-SourceCode) {
					margin: 0;
				}
			`}</style>
		</div>
	);
}

export default Playground;

// --- Controller ---

type T_UseControllerReturn = T_PlaygroundProps & {
	isSourceCodeTabSelected: boolean;
	isOutputTabSelected: boolean;
	handleTabClick: (index: 0 | 1) => () => void;
	contentRef: T_ReactRef<HTMLDivElement>;
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
		isOutputTabSelected: tab === 0,
		isSourceCodeTabSelected: tab === 1,

		// handlers
		handleTabClick,
	};
}
