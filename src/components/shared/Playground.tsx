import * as React from "react";
import cn from "classnames";

import { Button, Block, Icon, Text } from "~/components/primitive";
import EnvVars from "~/modules/env-vars";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { generateSlug } from "@diegofrayo/utils/strings";
import type DR from "@diegofrayo/types";

import SourceCode, { T_SourceCodeProps } from "./SourceCode";

type T_PlaygroundProps = {
	fileName?: T_SourceCodeProps["fileName"];
	language: T_SourceCodeProps["language"];
	Preview: DR.React.FunctionComponent;
	sourceCode: T_SourceCodeProps["code"];
	height?: number | "auto";
};

function Playground({
	fileName = "",
	language,
	Preview,
	sourceCode,
	height = 500,
}: T_PlaygroundProps) {
	// --- STATES & REFS ---
	const [tab, setTab] = React.useState(0);
	const contentRef = React.useRef<HTMLDivElement>(null);

	// --- VARS ---
	const isOutputTabSelected = tab === 0;
	const isSourceCodeTabSelected = tab === 1;

	// --- HANDLERS ---
	function handleTabClick(index: number): () => void {
		return () => {
			setTab(index);

			if (contentRef.current) {
				contentRef.current.scrollTop = 0;
			}
		};
	}

	return (
		<Block
			className="dr-playground root tw-flex tw-flex-col tw-border-4 dr-border-color-surface-300"
			style={{ height }}
			data-markdown-block
		>
			<Block
				className="tw-relative tw-flex-1"
				ref={contentRef}
			>
				{isSourceCodeTabSelected ? (
					<Block className="tw-absolute tw-inset-4 tw-overflow-auto">
						<SourceCode
							height="100%"
							fileName={fileName}
							language={language}
							code={sourceCode}
						/>
					</Block>
				) : (
					<Block className="tw-absolute tw-inset-4 tw-flex tw-flex-col tw-rounded-md tw-border-4 dr-border-color-surface-600">
						<Block className="tw-flex tw-flex-nowrap tw-items-center tw-justify-between tw-p-2 dr-bg-color-surface-600">
							<Block className="tw-flex tw-items-center">
								{createArray(3).map((element) => {
									return (
										<Block
											key={generateSlug(`playground-block-element-${element}`)}
											className={cn(
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
							<Text className="tw-ml-4 tw-mr-3 tw-flex-1 tw-truncate tw-rounded-full tw-px-4 tw-py-1.5 tw-text-xs dr-bg-color-surface-400">
								{EnvVars.NEXT_PUBLIC_WEBSITE_URL}
							</Text>
							<Block>
								<Icon
									size={28}
									icon={Icon.icon.MENU}
								/>
							</Block>
						</Block>
						<Block className="tw-flex-1 tw-overflow-auto tw-p-2">
							<Preview />
						</Block>
					</Block>
				)}
			</Block>
			<Block className="tw-flex-no-wrap tw-flex tw-border-t-4 tw-text-sm dr-border-color-surface-300">
				<Button
					variant={Button.variant.SIMPLE}
					className={cn(
						"tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
						isOutputTabSelected && "tw-font-bold dr-bg-color-surface-300",
					)}
					onClick={handleTabClick(0)}
				>
					Preview
				</Button>
				<Button
					variant={Button.variant.SIMPLE}
					className={cn(
						"tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
						isSourceCodeTabSelected && "tw-font-bold dr-bg-color-surface-300",
					)}
					onClick={handleTabClick(1)}
				>
					Source code
				</Button>
			</Block>
		</Block>
	);
}

export default Playground;
