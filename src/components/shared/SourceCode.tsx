import * as React from "react";
import cn from "classnames";
import { highlight } from "sugar-high";

import { Block, Button, Icon, Link, Pre } from "~/components/primitive";
import AnalyticsService from "~/modules/analytics";
import v from "@diegofrayo/v";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import { throwError } from "@diegofrayo/utils/misc";
import { generateSlug } from "@diegofrayo/utils/strings";
import type DR from "@diegofrayo/types";

import CopyToClipboardPopover from "./CopyToClipboardPopover";

export type T_SourceCodeProps = {
	code: DR.React.Children;
	sourceURL?: string;
	className?: string;
};

function SourceCode({ code, sourceURL = "", className = "" }: T_SourceCodeProps) {
	// --- STATES & REFS ---
	const [highlightedCode, setHighlightedCode] = React.useState("");
	const [containerHeight, setContainerHeight] = React.useState<number | "auto">("auto");
	const containerRef = React.useRef<null | HTMLDivElement>(null);

	// --- UTILS ---
	const extractChildren = React.useCallback(function extractChildren(
		codeParam: T_SourceCodeProps["code"],
	) {
		const result = React.isValidElement(codeParam) ? codeParam.props.children : codeParam;

		return v.isString(result) ? result : throwError("Invalid text to copy or highlight");
	}, []);

	// --- EFFECTS ---
	React.useEffect(
		function highlightCode() {
			setHighlightedCode(highlight(extractChildren(code)));
		},
		[code, extractChildren],
	);

	React.useEffect(
		function onHighlightedCode() {
			if (highlightedCode && containerRef.current) {
				const sourceCodeHeight = containerRef.current.querySelector("pre")?.offsetHeight || 500;
				setContainerHeight(sourceCodeHeight > 500 ? 500 : "auto");
			}
		},
		[highlightedCode],
	);

	return (
		<Block
			className={cn(
				"dr-source-code",
				"tw-relative tw-overflow-hidden tw-rounded-md tw-border dr-bg-color-surface-200 dr-border-color-surface-300",
				className,
			)}
			style={{ height: containerHeight }}
			ref={containerRef}
			data-markdown-block
		>
			<Block className="tw-absolute tw-right-0 tw-top-0 tw-flex tw-w-full tw-justify-between tw-pb-1 tw-text-right dr-bg-color-surface-300">
				<Block className="tw-ml-2 tw-flex tw-pt-2">
					{createArray(3).map((element) => {
						return (
							<Block
								key={generateSlug(`SourceCode-Block-element-${element}`)}
								className={cn("tw-mr-1.5 tw-inline-block tw-rounded-full tw-wh-3 last:tw-mr-0", {
									"tw-bg-red-500": element === 1,
									"tw-bg-yellow-500": element === 2,
									"tw-bg-green-500": element === 3,
								})}
							/>
						);
					})}
				</Block>
				<Block>
					{v.isNotEmptyString(sourceURL) ? (
						<Link
							variant={Link.variant.SIMPLE}
							href={sourceURL}
							className="tw-mr-2 tw-inline-block"
							onClick={AnalyticsService.trackClickEvent("SOURCE_CODE|OPEN_LINK")}
							isExternalLink
						>
							<Icon icon={Icon.icon.EXTERNAL_LINK} />
						</Link>
					) : null}
					<CopyToClipboardPopover textToCopy={extractChildren(code)}>
						<Button
							variant={Button.variant.SIMPLE}
							className="tw-mr-2 tw-inline-block"
							onClick={AnalyticsService.trackClickEvent("SOURCE_CODE|COPY_CODE")}
						>
							<Icon icon={Icon.icon.COPY} />
						</Button>
					</CopyToClipboardPopover>
				</Block>
			</Block>
			<Pre
				variant={Pre.variant.UNSTYLED}
				className="tw-max-h-full tw-overflow-auto tw-p-3 tw-pt-10 tw-text-base"
				dangerouslySetInnerHTML={{ __html: highlightedCode }}
			/>
		</Block>
	);
}

export default SourceCode;
