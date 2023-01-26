import * as React from "react";
import classNames from "classnames";
import { ErrorBoundary } from "react-error-boundary";
import Highlight, { defaultProps } from "prism-react-renderer";
import highLightTheme from "prism-react-renderer/themes/nightOwl";
// NOTE: Nice themes => nightOwl | drakula | oceanicNext | okaidia | palenight | vsDark

import { Block, Button, Icon, InlineText, Link, Pre, Space } from "~/@legacy/src/components/primitive";
import { useTranslation } from "~/@legacy/src/features/i18n";
import twcss from "~/@legacy/src/lib/twcss";
import v from "~/@legacy/src/lib/v";
import { handleCopyToClipboardClick } from "~/@legacy/src/utils/browser";
import { generateSlug } from "~/@legacy/src/utils/strings";
import type { T_ReactElement, T_ReactElementNullable, T_ReactFunctionComponent } from "~/@legacy/src/types";

type T_SourceCodeProps = {
	// DOCS: https://github.com/FormidableLabs/prism-react-renderer#language
	language: "jsx" | "tsx" | "css" | "typescript" | "javascript" | "bash" | "yaml" | "markdown";
	code: string;
	fileName?: string;
	sourceURL?: string;
	className?: string;
	height?: "100%" | "auto" | number;
	noBorder?: boolean;
};

function SourceCode({
	language,
	code,
	fileName = "",
	sourceURL = "",
	className = "",
	height = "auto",
	noBorder = false,
}: T_SourceCodeProps): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	// vars
	const codeTitle = v.isNotEmptyString(fileName)
		? `// ${fileName}`
		: v.isNotEmptyString(sourceURL)
		? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
		: "";

	return (
		<Block
			className={classNames(
				"dfr-SourceCode tw-flex tw-flex-col dfr-bg-color-wb dark:tw-bg-transparent",
				className,
			)}
			style={{
				height,
				maxHeight: height === "auto" ? 500 : "none",
			}}
			data-markdown-block
		>
			<Block
				className={classNames(
					"tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-between tw-py-2 tw-font-mono tw-text-sm dfr-text-color-bw",
					noBorder
						? ""
						: "tw-rounded-t-md tw-border tw-border-b-0 tw-px-4 tw-pr-2 dfr-border-color-primary dark:dfr-bg-color-tertiary",
				)}
			>
				{v.isNotEmptyString(codeTitle) ? (
					<code className="tw-mr-4 tw-flex-1 tw-truncate tw-font-bold">{codeTitle}</code>
				) : null}
				<InlineText className="tw-ml-auto tw-inline-block tw-flex-shrink-0 tw-bg-yellow-300 tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-text-yellow-700">
					{language}
				</InlineText>
			</Block>

			<ErrorBoundary FallbackComponent={ErrorFallback(code)}>
				<Highlight
					{...defaultProps}
					code={code}
					language={language}
					theme={highLightTheme}
				>
					{({
						className: classNameProp,
						style,
						tokens,
						getLineProps,
						getTokenProps,
					}): T_ReactElementNullable => {
						return (
							<Pre
								variant={Pre.variant.UNSTYLED}
								className={classNames(
									classNameProp,
									"tw-flex-1 tw-overflow-x-auto tw-p-4 tw-text-base",
								)}
								style={style}
							>
								{tokens.map((line, i) => {
									return (
										<Line
											key={generateSlug(`Line-i-${i}`)}
											{...getLineProps({ line, key: i })}
										>
											<LineNo>{i + 1}</LineNo>
											<LineContent>
												{line.map((token, key) => {
													return (
														<InlineText
															key={generateSlug(`InlineText-key-${key}`)}
															{...getTokenProps({ token, key })}
														/>
													);
												})}
											</LineContent>
										</Line>
									);
								})}
							</Pre>
						);
					}}
				</Highlight>
			</ErrorBoundary>

			<Block
				className={classNames(
					"tw-flex tw-flex-shrink-0 tw-flex-col-reverse tw-py-2 tw-text-sm sm:tw-flex-row sm:tw-justify-end",
					noBorder
						? ""
						: "tw-rounded-b-md tw-border tw-border-t-0 tw-px-4 tw-pr-2 dfr-border-color-primary dark:dfr-bg-color-tertiary",
				)}
			>
				{v.isNotEmptyString(sourceURL) ? (
					<React.Fragment>
						<Link
							variant={Link.variant.SECONDARY}
							href={sourceURL}
							className="tw-text-right"
							isExternalLink
						>
							<Icon
								icon={Icon.icon.GITHUB}
								size={16}
								withBackgroundWhenDarkMode
							/>
							<InlineText className="tw-ml-1 tw-lowercase">{t("page:see_source_code")}</InlineText>
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
		</Block>
	);
}

export default SourceCode;
export type { T_SourceCodeProps };

// --- Components ---

const Line = twcss.div`tw-table-row`;
const LineNo = twcss.span`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none`;
const LineContent = twcss.span`tw-table-cell`;

function ErrorFallback(code: T_SourceCodeProps["code"]): T_ReactFunctionComponent<{
	error: Error;
	resetErrorBoundary: (...args: Array<unknown>) => void;
}> {
	function ErrorFallbackComponent(): T_ReactElement {
		return (
			<Pre
				variant={Pre.variant.STYLED}
				wrapperClassName="tw-flex-1"
			>
				{code}
			</Pre>
		);
	}

	return ErrorFallbackComponent;
}
