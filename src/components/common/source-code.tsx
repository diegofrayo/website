import { isValidElement, useMemo } from "react";
import { highlight } from "sugar-high";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { throwError } from "@diegofrayo-pkg/utilities/errors";
import { isNonEmptyString, isString } from "@diegofrayo-pkg/validator";

import { Box, Button, Icon, InlineText, Link, Paragraph, Pre } from "~/components/primitive";
import { ButtonVariants } from "~/components/primitive/button";
import { IconCatalog } from "~/components/primitive/icon";
import { LinkVariants } from "~/components/primitive/link";
import { PreVariants } from "~/components/primitive/pre";

import CopyToClipboardPopover from "./copy-to-clipboard-popover";

export type SourceCodeProps = {
	code: ReactTypes.Children;

	className?: string;
	language?: string;
	sourceURL?: string;
	title?: string;
};

function SourceCode({
	code,
	className,
	language: languageProp = "code",
	sourceURL = "",
	title = "",
}: SourceCodeProps): ReactTypes.JSXElement {
	// --- COMPUTED STATES ---
	const codeText = extractChildren(code);
	const language = extractLanguage(code) ?? languageProp;
	const highlightedCode = useMemo(() => highlight(codeText), [codeText]);
	const hasSourceURL = isNonEmptyString(sourceURL);

	// --- STYLES ---
	const classes = {
		container: cn("dr-source-code", "flex max-h-125 flex-col border bg-zinc-900", className),
		header: cn("flex shrink-0 justify-between border-b border-zinc-700 bg-zinc-900"),
		title: cn("flex gap-2 bg-zinc-700 p-2 pr-8 text-sm text-zinc-100"),
		actions: cn("flex items-center gap-2 px-2 text-white"),
		sourceLink: cn("leading-0"),
		code: cn("hide-scrollbar max-h-full min-h-0 flex-1 overflow-auto p-3 text-sm"),
	};

	return (
		<Box
			as="section"
			className={classes.container}
			data-markdown-block
		>
			<Box
				as="header"
				className={classes.header}
			>
				<Paragraph className={classes.title}>
					<Icon name={IconCatalog.CODE_XML} />
					<InlineText>{`${title}.${language}`}</InlineText>
				</Paragraph>

				<Box className={classes.actions}>
					{hasSourceURL && (
						<Link
							className={classes.sourceLink}
							variant={LinkVariants.SMOOTH}
							href={sourceURL}
							isExternalLink
						>
							<Icon name={IconCatalog.EXTERNAL_LINK} />
						</Link>
					)}
					<CopyToClipboardPopover textToCopy={codeText}>
						<Button variant={ButtonVariants.SMOOTH}>
							<Icon name={IconCatalog.COPY} />
						</Button>
					</CopyToClipboardPopover>
				</Box>
			</Box>

			<Pre
				variant={PreVariants.UNSTYLED}
				className={classes.code}
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
