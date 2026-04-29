import { useRef, useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { createArray } from "@diegofrayo-pkg/utilities/arrays-and-objects";
import { generateSlug } from "@diegofrayo-pkg/utilities/strings";

import { Box, Button, Icon, IconCatalog, InlineText, Paragraph } from "../primitive";
import SourceCode, { type SourceCodeProps } from "./source-code";

type PlaygroundProps = {
	Preview: ReactTypes.FunctionComponent;
	height?: number;
	language?: string;
	sourceCode: SourceCodeProps["code"];
	title?: string;
};

function Playground({
	Preview,
	height = 500,
	language = "",
	title = "",
	sourceCode,
}: PlaygroundProps) {
	// --- STATE ---
	const [tab, setTab] = useState(0);
	const contentRef = useRef<HTMLDivElement>(null);

	// --- COMPUTED STATES ---
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
		<Box
			className="dr-playground flex flex-col border-4 border-zinc-700 bg-white"
			style={{ height }}
			data-markdown-block
		>
			<Box
				className="relative flex-1"
				ref={contentRef}
			>
				{isSourceCodeTabSelected ? (
					<Box className="absolute inset-4 overflow-auto">
						<SourceCode
							code={sourceCode}
							language={language}
							title={title}
						/>
					</Box>
				) : (
					<Box className="absolute inset-4 flex flex-col rounded-md border-4 border-black">
						<Box className="flex flex-nowrap items-center justify-between gap-4 bg-black p-2">
							<Box className="flex items-center">
								{createArray(3).map((element) => {
									return (
										<Box
											key={generateSlug(`Playground-Box-element-${element}`)}
											className={cn("mr-1.5 inline-block size-3 rounded-full last:mr-0", {
												"bg-red-500": element === 1,
												"bg-amber-500": element === 2,
												"bg-green-500": element === 3,
											})}
										/>
									);
								})}
							</Box>
							<Paragraph className="flex-1 truncate rounded-full bg-zinc-700 px-4 py-1.5 text-xs font-bold text-white">
								{window.location.href}
							</Paragraph>
						</Box>
						<Box className="hide-scrollbar flex-1 overflow-auto p-2">
							<Preview />
						</Box>
					</Box>
				)}
			</Box>
			<Box className="flex-no-wrap flex border-t-4 border-zinc-700 text-sm">
				<Button
					variant={Button.variant.SMOOTH}
					className={cn(
						"flex-1 cursor-pointer px-2 py-4 text-center",
						isOutputTabSelected && "bg-zinc-700 font-bold text-white",
					)}
					onClick={handleTabClick(0)}
				>
					<Icon icon={IconCatalog.APP_WINDOW} /> <InlineText>Preview</InlineText>
				</Button>
				<Button
					variant={Button.variant.SMOOTH}
					className={cn(
						"flex-1 cursor-pointer px-2 py-4 text-center",
						isSourceCodeTabSelected && "bg-zinc-700 font-bold text-white",
					)}
					onClick={handleTabClick(1)}
				>
					<Icon icon={IconCatalog.CODE_XML} /> <InlineText>Source code</InlineText>
				</Button>
			</Box>
		</Box>
	);
}

export default Playground;
