import { useRef, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import { withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { createArray } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";

import { Box, Button, Icon, InlineText, Paragraph } from "~/components/primitive";
import { ButtonVariants } from "~/components/primitive/button";
import { IconCatalog } from "~/components/primitive/icon";

import SourceCode, { type SourceCodeProps } from "./source-code";

type PlaygroundProps = {
	Preview: ReactTypes.FunctionComponent;
	sourceCode: SourceCodeProps["code"];

	height?: number;
	language?: string;
	title?: string;
};

function Playground({
	Preview,
	sourceCode,
	height = 500,
	language = "",
	title = "",
}: PlaygroundProps): ReactTypes.JSXElement {
	// --- STATES & REFS ---
	const [tab, setTab] = useState(OUTPUT_TAB);
	const contentRef = useRef<HTMLDivElement>(null);

	// --- COMPUTED STATES ---
	const isOutputTabSelected = tab === OUTPUT_TAB;
	const isSourceCodeTabSelected = tab === SOURCE_CODE_TAB;

	// --- STYLES ---
	const classes = {
		container: cn("dr-playground flex flex-col border-4 border-zinc-700 bg-white"),
		content: cn("relative flex-1"),
		tabs: cn("flex-no-wrap flex border-t-4 border-zinc-700 text-sm"),
		tab: (isSelected: boolean): string =>
			cn(
				"flex-1 cursor-pointer px-2 py-4 text-center",
				isSelected && "bg-zinc-700 font-bold text-white",
			),
	};

	// --- HANDLERS ---
	function handleOutputTabClick(): void {
		selectTab(OUTPUT_TAB);
	}

	function handleSourceCodeTabClick(): void {
		selectTab(SOURCE_CODE_TAB);
	}

	// --- UTILS ---
	function selectTab(index: number): void {
		setTab(index);

		if (contentRef.current) {
			contentRef.current.scrollTop = 0;
		}
	}

	return (
		<Box
			className={classes.container}
			style={{ height }}
			data-markdown-block
		>
			<Box
				className={classes.content}
				ref={contentRef}
			>
				<PlaygroundTabContent
					Preview={Preview}
					isSourceCodeTabSelected={isSourceCodeTabSelected}
					language={language}
					sourceCode={sourceCode}
					title={title}
				/>
			</Box>
			<Box className={classes.tabs}>
				<Button
					variant={ButtonVariants.SMOOTH}
					className={classes.tab(isOutputTabSelected)}
					onClick={handleOutputTabClick}
				>
					<Icon name={IconCatalog.APP_WINDOW} /> <InlineText>Preview</InlineText>
				</Button>
				<Button
					variant={ButtonVariants.SMOOTH}
					className={classes.tab(isSourceCodeTabSelected)}
					onClick={handleSourceCodeTabClick}
				>
					<Icon name={IconCatalog.CODE_XML} /> <InlineText>Source code</InlineText>
				</Button>
			</Box>
		</Box>
	);
}

export default Playground;

// --- CONSTANTS ---

const OUTPUT_TAB = 0;
const SOURCE_CODE_TAB = 1;

// --- COMPONENTS ---

type PlaygroundTabContentProps = Pick<PlaygroundProps, "Preview" | "sourceCode"> & {
	isSourceCodeTabSelected: boolean;
	language: string;
	title: string;
};

function PlaygroundTabContent({
	Preview,
	isSourceCodeTabSelected,
	language,
	sourceCode,
	title,
}: PlaygroundTabContentProps): ReactTypes.JSXElement {
	// --- STYLES ---
	const classes = {
		sourceCode: cn("absolute inset-4 overflow-auto"),
		browser: cn("absolute inset-4 flex flex-col rounded-md border-4 border-black"),
		browserBar: cn("flex flex-nowrap items-center justify-between gap-4 bg-black p-2"),
		browserButtons: cn("flex items-center"),
		browserButton: (element: number): string =>
			cn("mr-1.5 inline-block size-3 rounded-full last:mr-0", {
				"bg-red-500": element === 1,
				"bg-amber-500": element === 2,
				"bg-green-500": element === 3,
			}),
		preview: cn("hide-scrollbar flex-1 overflow-auto p-2"),
	};

	if (isSourceCodeTabSelected) {
		return (
			<Box className={classes.sourceCode}>
				<SourceCode
					code={sourceCode}
					language={language}
					title={title}
				/>
			</Box>
		);
	}

	return (
		<Box className={classes.browser}>
			<Box className={classes.browserBar}>
				<Box className={classes.browserButtons}>
					{createArray(3).map((element) => {
						return (
							<Box
								key={generateSlug(`Playground-Box-element-${element}`)}
								className={classes.browserButton(element)}
							/>
						);
					})}
				</Box>
				<CurrentUrl />
			</Box>
			<Box className={classes.preview}>
				<Preview />
			</Box>
		</Box>
	);
}

const CurrentUrl = withRenderInBrowser(function CurrentUrl() {
	// --- STYLES ---
	const classes = {
		url: cn("flex-1 truncate rounded-full bg-zinc-700 px-4 py-1.5 text-xs font-bold text-white"),
	};

	return <Paragraph className={classes.url}>{window.location.href}</Paragraph>;
});
