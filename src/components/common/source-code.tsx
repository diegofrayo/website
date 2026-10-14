import { isValidElement, useMemo } from "react";
import { highlight } from "sugar-high";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { throwError } from "@diegofrayo-pkg/utilities/errors";
import { isNonEmptyString, isString } from "@diegofrayo-pkg/validator";

import { Box, Button, Icon, InlineText, Link, Paragraph, Pre } from "~/components/primitive";
import { ButtonVariant } from "~/components/primitive/button";
import { IconCatalog } from "~/components/primitive/icon";
import { LinkVariant } from "~/components/primitive/link";

import CopyToClipboardPopover from "./copy-to-clipboard-popover";

export type SourceCodeProps = {
	className?: string;
	code: ReactTypes.Children;
	sourceURL?: string;
	title?: string;
	language?: string;
};

function SourceCode({
	code,
	sourceURL = "",
	className = "",
	title = "",
	language: languageProp = "code",
}: SourceCodeProps): ReactTypes.JSXElement {
	// --- COMPUTED STATES ---
	const language = extractLanguage(code) ?? languageProp;
	const highlightedCode = useMemo(() => highlight(extractChildren(code)), [code]);

	return (
		<Box
			as="section"
			className={cn("dr-source-code", "flex max-h-125 flex-col border bg-zinc-900", className)}
			data-markdown-block
		>
			<Box
				as="header"
				className="flex shrink-0 justify-between border-b border-zinc-700 bg-zinc-900"
			>
				<Paragraph className="flex gap-2 bg-zinc-700 p-2 pr-8 text-sm text-zinc-100">
					<Icon name={IconCatalog.CODE_XML} />
					<InlineText>{`${title}.${language}`}</InlineText>
				</Paragraph>

				<Box className="flex items-center gap-2 px-2 text-white">
					{isNonEmptyString(sourceURL) && (
						<Link
							className="leading-0"
							variant={LinkVariant.SMOOTH}
							href={sourceURL}
							isExternalLink
						>
							<Icon name={IconCatalog.EXTERNAL_LINK} />
						</Link>
					)}
					<CopyToClipboardPopover textToCopy={extractChildren(code)}>
						<Button variant={ButtonVariant.SMOOTH}>
							<Icon name={IconCatalog.COPY} />
						</Button>
					</CopyToClipboardPopover>
				</Box>
			</Box>

			<Pre
				variant={Pre.variant.UNSTYLED}
				className="hide-scrollbar max-h-full min-h-0 flex-1 overflow-auto p-3 text-sm"
				dangerouslySetInnerHTML={{ __html: highlightedCode }}
			/>
		</Box>
	);
}

export default SourceCode;

// --- UTILS ---

function extractChildren(code: SourceCodeProps["code"]): string {
	const result = isValidElement<CodeChildElementProps>(code) ? code.props.children : code;

	return isString(result) ? result : throwError("Invalid text to copy or highlight");
}

function extractLanguage(code: SourceCodeProps["code"]): string | undefined {
	if (!isValidElement<CodeChildElementProps>(code)) return undefined;

	return code.props.className.replace("language-", "");
}

// --- TYPES ---

type CodeChildElementProps = {
	children: ReactTypes.Children;
	className: string;
};
