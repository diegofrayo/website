import * as React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Link, Space } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import twcss from "~/lib/twcss";
import { handleCopyToClipboardClick } from "~/utils/browser";
import { generateSlug } from "~/utils/strings";
import { isNotEmptyString } from "~/utils/validations";
import type { T_ReactElement } from "~/types";

type T_SourceCodeProps = {
	language: "jsx" | "tsx" | "css" | "typescript" | "javascript" | "bash" | "yaml";
	code: string;
	fileName?: string;
	sourceURL?: string;
	displaySourceCodeDetails?: boolean;
};

function SourceCode({
	language,
	fileName = "",
	code = "",
	sourceURL = "",
	displaySourceCodeDetails = true,
}: T_SourceCodeProps): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	// vars
	const codeTitle = isNotEmptyString(fileName)
		? `// ${generateSlug(fileName)}`
		: isNotEmptyString(sourceURL)
		? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
		: "";

	// render
	return (
		<div
			className="dfr-SourceCode root dfr-bg-color-wb dark:tw-bg-transparent"
			data-markdown-block
		>
			{displaySourceCodeDetails ? (
				<Block className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-t-md tw-border tw-border-b-0 tw-px-2 tw-py-2 tw-font-mono tw-text-sm dfr-border-color-secondary dfr-text-color-bw dark:tw-border-0 dark:dfr-bg-color-tertiary">
					{isNotEmptyString(codeTitle) ? (
						<code className="tw-mr-4 tw-flex-1 tw-font-bold">{codeTitle}</code>
					) : null}
					<InlineText className="tw-ml-auto tw-inline-block tw-flex-shrink-0 tw-bg-yellow-300 tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-text-yellow-700">
						{language}
					</InlineText>
				</Block>
			) : null}

			<Highlight
				{...defaultProps}
				code={code}
				language={language}
				theme={dracula}
			>
				{({ className, style, tokens, getLineProps, getTokenProps }): T_ReactElement => {
					return (
						<pre
							className={classNames(
								className,
								"tw-p-4 tw-text-base dark:tw-border dark:dfr-border-color-gs-700",
							)}
							style={style}
						>
							{tokens.map((line, i) => {
								return (
									<Line
										// WARN: I use the index here because this is a external library and this code was taken from the examples page
										// eslint-disable-next-line react/no-array-index-key
										key={i}
										{...getLineProps({ line, key: i })}
									>
										<LineNo>{i + 1}</LineNo>
										<LineContent>
											{line.map((token, key) => {
												return (
													<InlineText
														// WARN: I use the index here because this is a external library and this code was taken from the examples page
														// eslint-disable-next-line react/no-array-index-key
														key={key}
														{...getTokenProps({ token, key })}
													/>
												);
											})}
										</LineContent>
									</Line>
								);
							})}
						</pre>
					);
				}}
			</Highlight>

			{displaySourceCodeDetails ? (
				<Block className="tw-flex tw-flex-col tw-rounded-b-md tw-border tw-border-t-0 tw-p-2 tw-text-sm dfr-border-color-secondary dark:tw-border-0  dark:dfr-bg-color-tertiary sm:tw-flex-row sm:tw-justify-end">
					{isNotEmptyString(sourceURL) ? (
						<React.Fragment>
							<Link
								variant={Link.variant.SECONDARY}
								href={sourceURL}
								className="tw-text-right"
								isExternalLink
							>
								<Icon
									icon={Icon.icon.GITHUB}
									withBackgroundWhenDarkMode
								/>
								<InlineText className="tw-ml-1 tw-lowercase">
									{t("page:see_source_code")}
								</InlineText>
							</Link>
							<Space responsive="tw-block tw-mb-1 tw-mr-0 sm:tw-inline-block sm:tw-mb-0 sm:tw-mr-6" />
						</React.Fragment>
					) : null}
					<Button
						variant={Button.variant.DEFAULT}
						className="tw-text-right"
						data-clipboard-text={code}
						onClick={handleCopyToClipboardClick}
					>
						<Icon icon={Icon.icon.CLIPBOARD} />
						<InlineText className="tw-ml-1 tw-lowercase">{t("page:copy_to_clipboard")}</InlineText>
					</Button>
				</Block>
			) : null}

			<style jsx>
				{`
					.root :global(.dfr-Code--multiline) {
						border-radius: 0;
						box-shadow: none;
					}
				`}
			</style>
		</div>
	);
}

export default SourceCode;
export type { T_SourceCodeProps };

// --- Components ---

const Line = twcss.div`tw-table-row`;
const LineNo = twcss.span`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none`;
const LineContent = twcss.span`tw-table-cell`;
