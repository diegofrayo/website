// TODO: Fix this eslint error
/* eslint-disable react-hooks/set-state-in-effect */

import { isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { highlight } from "sugar-high";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { throwError } from "@diegofrayo-pkg/utilities/errors";
import { isNotEmptyString, isString } from "@diegofrayo-pkg/validator";

import { Box, Button, Icon, IconCatalog, InlineText, Link, Pre, Text } from "../primitive";
import CopyToClipboardPopover from "./copy-to-clipboard-popover";

export type SourceCodeProps = {
	className?: string;
	code: DR.React.Children;
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
}: SourceCodeProps) {
	// --- STATE & REFS ---
	const [highlightedCode, setHighlightedCode] = useState("");
	const [containerHeight, setContainerHeight] = useState<number | "auto">("auto");
	const [language, setLanguage] = useState(languageProp);
	const containerRef = useRef<null | HTMLDivElement>(null);

	// --- UTILS ---
	const extractChildren = useCallback(function extractChildren(codeParam: SourceCodeProps["code"]) {
		const result = isValidElement<CodeChildElementProps>(codeParam)
			? codeParam.props.children
			: codeParam;

		return isString(result) ? result : throwError("Invalid text to copy or highlight");
	}, []);

	const extractLanguage = useCallback(function extractChildren(codeParam: SourceCodeProps["code"]) {
		if (!isValidElement<CodeChildElementProps>(codeParam)) return;

		const language = codeParam.props.className.replace("language-", "");
		setLanguage(language);
	}, []);

	// --- EFFECTS ---
	useEffect(
		function highlightCode() {
			extractLanguage(code);
			setHighlightedCode(highlight(extractChildren(code)));
		},
		[code, extractChildren, extractLanguage],
	);

	useEffect(
		function onHighlightedCode() {
			if (highlightedCode && containerRef.current) {
				const sourceCodeHeight = containerRef.current.querySelector("pre")?.offsetHeight || 500;
				setContainerHeight(sourceCodeHeight > 500 ? 500 : "auto");
			}
		},
		[highlightedCode],
	);

	return (
		<Box
			as="section"
			className={cn("dr-source-code", "flex flex-col border bg-zinc-900", className)}
			style={{ height: containerHeight }}
			ref={containerRef}
			data-markdown-block
		>
			<Box
				as="header"
				className="flex shrink-0 justify-between border-b border-zinc-700 bg-zinc-900"
			>
				<Text className="flex gap-2 bg-zinc-700 p-2 pr-8 text-sm text-zinc-100">
					<Icon icon={IconCatalog.CODE_XML} />
					<InlineText>{`${title}.${language}`}</InlineText>
				</Text>

				<Box className="flex items-center gap-2 px-2 text-white">
					{isNotEmptyString(sourceURL) && (
						<Link
							className="leading-0"
							variant={Link.variant.SMOOTH}
							href={sourceURL}
							isExternalLink
						>
							<Icon icon={IconCatalog.EXTERNAL_LINK} />
						</Link>
					)}
					<CopyToClipboardPopover textToCopy={extractChildren(code)}>
						<Button variant={Button.variant.SMOOTH}>
							<Icon icon={IconCatalog.COPY} />
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

// --- TYPES ---

type CodeChildElementProps = {
	children: DR.React.Children;
	className: string;
};
