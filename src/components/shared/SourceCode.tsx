import * as React from "react";
import cn from "classnames";

import { Block, Code, Icon, InlineText, Link, Pre, Space } from "~/components/primitive";
import v from "@diegofrayo/v";

import CopyToClipboardPopover from "./CopyToClipboardPopover";

export type T_SourceCodeProps = {
	language: "jsx" | "tsx" | "css" | "typescript" | "javascript" | "bash" | "yaml" | "markdown";
	code: string;
	fileName?: string;
	sourceURL?: string;
	className?: string;
	height?: "100%" | "auto" | number;
};

function SourceCode({
	language,
	code,
	fileName = "",
	sourceURL = "",
	className = "",
	height = "auto",
}: T_SourceCodeProps) {
	// --- VARS ---
	const codeTitle = v.isNotEmptyString(fileName)
		? `// ${fileName}`
		: v.isNotEmptyString(sourceURL)
		? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
		: "";

	return (
		<Block
			className={cn(
				"dr-source-code tw-flex tw-flex-col tw-rounded-md tw-border dr-border-color-surface-300",
				className,
			)}
			style={{
				height,
				maxHeight: height === "auto" ? 500 : "none",
			}}
			data-markdown-block
		>
			<Block className="tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-between tw-rounded-t-md tw-px-2 tw-py-2 tw-font-mono tw-text-sm">
				{v.isNotEmptyString(codeTitle) ? (
					<Code className="tw-mr-4 tw-flex-1 tw-truncate tw-font-bold">{codeTitle}</Code>
				) : null}
				<InlineText className="tw-ml-auto tw-inline-block tw-flex-shrink-0 tw-bg-yellow-300 tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-text-yellow-700">
					{language}
				</InlineText>
			</Block>

			<Pre
				variant={Pre.variant.HIGHLIGHTED}
				className="tw-flex-1 tw-border-y dr-border-color-surface-300"
			>
				{code}
			</Pre>

			<Block className="tw-flex tw-flex-shrink-0 tw-flex-col-reverse tw-rounded-b-md tw-px-2 tw-py-2 tw-text-sm tw-font-bold tw-text-white sm:tw-flex-row sm:tw-justify-end">
				{v.isNotEmptyString(sourceURL) ? (
					<React.Fragment>
						<Link
							variant={Link.variant.SIMPLE}
							href={sourceURL}
							className="tw-ml-auto tw-inline-block tw-w-48 tw-text-right sm:tw-ml-0 sm:tw-text-left"
							isExternalLink
						>
							<Icon
								icon={Icon.icon.GITHUB_MONO}
								size={16}
							/>
							<InlineText className="tw-ml-1 tw-lowercase">See source code</InlineText>
						</Link>
						<Space responsive="tw-block tw-mb-1 tw-mr-0 sm:tw-inline-block sm:tw-mb-0 sm:tw-mr-6" />
					</React.Fragment>
				) : null}

				<CopyToClipboardPopover
					textToCopy={code}
					buttonClassName="tw-text-right tw-w-48 tw-ml-auto tw-inline-block"
				>
					<Icon icon={Icon.icon.CLIPBOARD} />
					<InlineText className="tw-ml-1 tw-lowercase">Copy to clipboard</InlineText>
				</CopyToClipboardPopover>
			</Block>
		</Block>
	);
}

export default SourceCode;
