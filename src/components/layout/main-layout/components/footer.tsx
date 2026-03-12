import { useBoolean, useOnScroll } from "@diegofrayo-pkg/hooks";
import { getScrollPosition, setScrollPosition } from "@diegofrayo-pkg/utilities/browser";
import AnalyticsService from "@diegofrayo-features/analytics";
import {
	Box,
	Button,
	Icon,
	IconCatalog,
	InlineText,
	Link,
	Text,
} from "@diegofrayo-features/components/primitive";

import { Routes } from "~/constants";

function Footer() {
	return (
		<Box
			as="footer"
			className="bg-black py-4 text-center text-zinc-500 print:hidden"
		>
			<Text className="text-sm text-white">
				<InlineText>© 2026 All rights reserved | Coded by </InlineText>
				<Link
					href={Routes.INDEX}
					className="font-bold underline"
					variant={Link.variant.SMOOTH}
				>
					Diego Rayo
				</Link>
			</Text>

			<GoToTopButton />
		</Box>
	);
}

export default Footer;

// --- COMPONENTS ---

function GoToTopButton() {
	// --- STATE ---
	const {
		state: isButtonVisible,
		setFalse: hideButton,
		set: setIsButtonVisible,
	} = useBoolean(false);

	// --- EFFECTS ---
	useOnScroll({
		onScrollCallback: () => {
			const shouldShowButton = getScrollPosition() > 0;
			setIsButtonVisible(shouldShowButton);
		},
		onScrollStopCallback: () => hideButton(),
	});

	// --- HANDLERS ---
	function handleGoToTheTopClick() {
		AnalyticsService.trackEvent("GENERAL|GO_TO_TOP");
		setScrollPosition(0);
	}

	if (!isButtonVisible) return null;

	return (
		<Button
			variant={Button.variant.SMOOTH}
			className="fixed right-3 bottom-3 z-50 flex h-12 w-12 items-center justify-center rounded-md border border-zinc-800 bg-black text-2xl text-white sm:right-4 sm:bottom-4"
			onClick={handleGoToTheTopClick}
		>
			<Icon icon={IconCatalog.ARROW_UP} />
		</Button>
	);
}
