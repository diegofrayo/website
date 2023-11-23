import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, Space, Text, Title } from "~/components/primitive";
import { ROUTES } from "~/modules/routing";
import { recoverFromBreakingChanges } from "~/utils/errors-recovery";
import { useDidMount } from "@diegofrayo/hooks";

function ErrorPage({ title, variant }: { variant: "404" | "500"; title: string }) {
	// --- VARS ---
	const is404Error = variant === "404";

	// --- EFFECTS ---
	useDidMount(() => {
		if (!is404Error) {
			recoverFromBreakingChanges();
		}
	});

	// -- HANDLERS ---
	function handleReloadPageClick() {
		window.location.reload();
	}

	function handleGoToHomeClick() {
		window.location.href = ROUTES.HOME;
	}

	return (
		<Page
			config={{
				title,
				disableSEO: true,
			}}
		>
			<MainLayout>
				<Block className="tw-text-center">
					<Text className="tw-text-10xl">{is404Error ? "👀" : "🙉"}</Text>
					<Title
						is="h1"
						size={Title.size.LG}
					>
						{is404Error ? "404 " : ""}ERROR
					</Title>
					<Text className="">
						{is404Error ? "Sorry, this page does not exist" : "Sorry, something went wrong"}
					</Text>
					<Space size={6} />

					<Block>
						<Button
							variant={Button.variant.SIMPLE}
							className="tw-inline-block tw-border-b tw-border-dashed tw-pb-0.5 tw-font-bold dr-border-color-surface-300"
							onClick={handleGoToHomeClick}
						>
							Go to the Home
						</Button>

						{is404Error ? null : (
							<React.Fragment>
								<Space size={1} />
								<Button
									variant={Button.variant.SIMPLE}
									className="tw-inline-block tw-border-b tw-border-dashed tw-pb-0.5 tw-font-bold dr-border-color-surface-300"
									onClick={handleReloadPageClick}
								>
									Reload this page
								</Button>
							</React.Fragment>
						)}
					</Block>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default ErrorPage;
