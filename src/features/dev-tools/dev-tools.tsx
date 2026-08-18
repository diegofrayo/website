import { useState } from "react";

import cn from "@diegofrayo-pkg/cn";
import { withConditionalRender, withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import { useWindowSize } from "@diegofrayo-pkg/hooks";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";

import { Box, Button, Icon, InlineText } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

import AuthService, { useAuth } from "../auth";
import ToolsMenu from "./components/tools-menu";

type DevToolsProps = {
	devURL: string;
	productionURL: string;
};

const DevTools = withConditionalRender(function DevTools({ devURL, productionURL }: DevToolsProps) {
	// --- STATE & REFS ---
	const [isContentExpanded, setIsContentExpanded] = useState(false);

	// --- HANDLERS ---
	function handleExpandContentClick() {
		setIsContentExpanded(true);
	}

	function handleHideContentClick() {
		setIsContentExpanded(false);
	}

	return (
		<Box className="fixed bottom-0 left-0 z-50 flex h-12 items-center overflow-x-auto rounded-tr-md bg-zinc-700 print:hidden">
			{isContentExpanded ? (
				<>
					<Box className="flex items-center gap-2 px-3">
						<ToolsMenu
							productionURL={productionURL}
							devURL={devURL}
						/>
						<StatusIndicators />
						<WindowSize />
					</Box>
					<Button
						className="h-full bg-zinc-600 px-3 leading-none"
						onClick={handleHideContentClick}
					>
						<Icon
							color="text-white"
							icon={IconCatalog.CHEVRON_LEFT}
						/>
					</Button>
				</>
			) : (
				<Button
					className="h-full bg-zinc-600 px-3 leading-none"
					onClick={handleExpandContentClick}
				>
					<Icon
						color="text-white"
						icon={IconCatalog.CHEVRON_RIGHT}
					/>
				</Button>
			)}
		</Box>
	);
})(() => isDevelopmentEnvironment() || AuthService.isUserLoggedIn());

export default DevTools;

// --- COMPONENTS ---

function StatusIndicators() {
	// --- HOOKS ---
	const { isUserLoggedIn } = useAuth();

	// --- STYLES ---
	const classes = {
		indicator: cn([
			"flex items-center justify-center",
			"size-6 border border-green-600 bg-green-700 text-white",
			"relative rounded-full",
		]),
	};

	return (
		<Box className="flex gap-1">
			{isUserLoggedIn && (
				<Box className={classes.indicator}>
					<Icon
						icon={IconCatalog.CIRCLE_USER}
						size={14}
					/>
				</Box>
			)}
		</Box>
	);
}

const WindowSize = withRenderInBrowser(function WindowSize() {
	// --- HOOKS ---
	const size = useWindowSize();

	return (
		<Box className="text-sm font-bold text-white">
			<InlineText>{size.join("x")} | </InlineText>
			<InlineText className="relative top-0.5 inline-block sm:hidden">📱</InlineText>
			<InlineText className="hidden uppercase sm:inline-block md:hidden">sm</InlineText>
			<InlineText className="hidden uppercase md:inline-block lg:hidden">md</InlineText>
			<InlineText className="hidden uppercase lg:inline-block">lg</InlineText>
		</Box>
	);
});
