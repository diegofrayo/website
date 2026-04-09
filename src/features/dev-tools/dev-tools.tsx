import { useState } from "react";

import { useBrowserStorage } from "@diegofrayo-pkg/browser-storage";
import cn from "@diegofrayo-pkg/cn";
import { withConditionalRender, withRenderInBrowser } from "@diegofrayo-pkg/hocs";
import { useDidMount, useWindowSize } from "@diegofrayo-pkg/hooks";
import { isDevelopmentEnvironment } from "@diegofrayo-pkg/utilities/environment";

import { Box, Button, Icon, IconCatalog, InlineText } from "~/components/primitive";

import { AuthService } from "../auth";
import ToolsMenu from "./components/tools-menu";

const DevTools = withConditionalRender(function DevTools({
	productionURL,
}: {
	productionURL: string;
}) {
	// --- STATE & REFS ---
	const [isContentExpanded, setIsContentExpanded] = useBrowserStorage({
		key: "DR_DEV_TOOLS",
		readInitialValueFromStorage: true,
		value: false,
		saveDuringCreation: true,
	});

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
						<ToolsMenu productionURL={productionURL} />
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
	// --- STATE & REFS ---
	const [isAuthFlagVisible, setIsAuthFlagVisible] = useState(false);

	// --- STYLES ---
	const classes = {
		indicator: [
			"flex items-center justify-center",
			"border bg-zinc-200 border-zinc-400 size-6 text-white",
			"relative rounded-full",
		],
	};

	// --- EFFECTS ---
	useDidMount(() => {
		setIsAuthFlagVisible(AuthService.isUserLoggedIn());
	});

	return (
		<Box className="flex gap-1">
			{isAuthFlagVisible && (
				<Box className={cn(classes.indicator, "bg-green-700")}>
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
			<InlineText className="inline-block sm:hidden">📱</InlineText>
			<InlineText className="hidden sm:inline-block md:hidden">sm</InlineText>
			<InlineText className="hidden md:inline-block lg:hidden">md</InlineText>
			<InlineText className="hidden lg:inline-block">lg</InlineText>
		</Box>
	);
});
