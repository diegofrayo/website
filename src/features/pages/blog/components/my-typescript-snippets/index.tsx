import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import classNames from "classnames";

import SourceCode, { T_SourceCodeProps } from "~/components/shared/SourceCode";
import { useTabs } from "~/hooks";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement } from "~/types";

type T_MTSCodeExample = {
	fileName?: T_SourceCodeProps["fileName"];
	languages: [T_SourceCodeProps["language"], T_SourceCodeProps["language"]];
	usageCode: string;
	typingCode: string;
	height?: "auto" | number;
};

function MTSCodeExample({
	fileName = "",
	languages,
	typingCode,
	usageCode,
	height = "auto",
}: T_MTSCodeExample): T_ReactElement {
	// hooks
	const { selectTab, selectedTabIndex } = useTabs();

	// vars
	const TABS_LIST = ["Types", "Usage"];

	// handlers
	function handleTabClick(tabIndex: number): () => void {
		return () => {
			selectTab(tabIndex);
		};
	}

	return (
		<Tabs.Root
			defaultValue={TABS_LIST[0]}
			orientation="horizontal"
			className="tw-flex tw-flex-col tw-border-4 dfr-border-color-primary"
			style={{ height }}
		>
			<Tabs.Content
				value={TABS_LIST[0]}
				className="tw-flex-1 tw-overflow-hidden tw-px-4 tw-py-1"
			>
				<SourceCode
					language={languages[0]}
					fileName={fileName || "Types"}
					code={typingCode}
					height="100%"
					noBorder
				/>
			</Tabs.Content>
			<Tabs.Content
				value={TABS_LIST[1]}
				className="tw-flex-1 tw-overflow-hidden tw-px-4 tw-py-1"
			>
				<SourceCode
					language={languages[1]}
					fileName={fileName || "Usage"}
					code={usageCode}
					height="100%"
					noBorder
				/>
			</Tabs.Content>
			<Tabs.List
				className="tw-flex-shrink-0 tw-border-t-4 tw-text-sm dfr-border-color-primary"
				aria-label="Typing and Usages tabs"
			>
				{TABS_LIST.map((tabName, index) => {
					return (
						<Tabs.Trigger
							key={generateSlug(`MTSCodeExample-Tabs.ListElement-tabName-${tabName}`)}
							value={TABS_LIST[index]}
							className={classNames(
								"tw-w-1/2 tw-p-2 tw-text-center",
								index === 0 && "tw-border-r dfr-border-color-primary",
								index === selectedTabIndex && "tw-font-bold  dfr-bg-color-secondary",
							)}
							onClick={handleTabClick(index)}
						>
							{tabName}
						</Tabs.Trigger>
					);
				})}
			</Tabs.List>
		</Tabs.Root>
	);
}

export default MTSCodeExample;
