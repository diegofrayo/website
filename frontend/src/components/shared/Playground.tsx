import * as React from "react";
// import * as Tabs from "@radix-ui/react-tabs";
import classNames from "classnames";

import { Button, Block, Icon, Text } from "~/components/primitive";
import { ENV_VARS } from "~/constants";
import { createArray } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement, T_ReactFunctionComponent } from "~/types";

import SourceCode, { T_SourceCodeProps } from "./SourceCode";

type T_PlaygroundProps = {
	fileName?: T_SourceCodeProps["fileName"];
	language: T_SourceCodeProps["language"];
	Preview: T_ReactFunctionComponent;
	sourceCode: T_SourceCodeProps["code"];
	height?: number | "auto";
};

function Playground({
	fileName = "Source code",
	language,
	Preview,
	sourceCode,
	height = 500,
}: T_PlaygroundProps): T_ReactElement {
	// states & refs
	const [tab, setTab] = React.useState(0);
	const contentRef = React.useRef<HTMLDivElement>(null);

	// vars
	const isOutputTabSelected = tab === 0;
	const isSourceCodeTabSelected = tab === 1;

	// handlers
	function handleTabClick(index: number): () => void {
		return () => {
			setTab(index);

			if (contentRef.current) {
				contentRef.current.scrollTop = 0;
			}
		};
	}

	return (
		<div
			className="dfr-Playground root tw-flex tw-flex-col tw-border-4 dfr-border-color-gs-black dfr-bg-color-wb dark:dfr-border-color-primary"
			style={{ height }}
			data-markdown-block
		>
			<Block
				className="tw-relative tw-flex-1"
				ref={contentRef}
			>
				{isSourceCodeTabSelected ? (
					<Block className="tw-absolute tw-inset-x-4 tw-inset-y-2 tw-overflow-auto">
						<SourceCode
							height="100%"
							fileName={fileName}
							language={language}
							code={sourceCode}
							noBorder
						/>
					</Block>
				) : (
					<Block className="tw-absolute tw-inset-4 tw-flex tw-flex-col tw-rounded-md tw-border-4 tw-border-gray-200">
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
							<Preview />
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
					Preview
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
					Source code
				</Button>
			</Block>
		</div>
	);
}

export default Playground;
