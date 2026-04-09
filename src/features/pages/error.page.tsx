import { MainLayout, Page } from "~/components/layout";
import { Box, Button, Space, Text, Title } from "~/components/primitive";

function ErrorPage({ title, variant }: { variant: "404" | "500"; title: string }) {
	// --- COMPUTED STATES ---
	const is404Error = variant === "404";
	const is500Error = variant === "500";

	// -- HANDLERS ---
	function handleReloadPageClick() {
		window.location.reload();
	}

	function handleGoToHomeClick() {
		window.location.href = "/";
	}

	return (
		<Page config={{ title, pathname: "/" }}>
			<MainLayout>
				<Box className="flex min-h-[80vh] flex-col items-center justify-center text-center">
					<Text className="text-10xl mb-4 leading-none">{is404Error ? "👀" : "🙉"}</Text>
					<Title
						as="h1"
						size={Title.size.LG}
					>
						{is404Error ? "404 " : ""}ERROR
					</Title>
					<Text>
						{is404Error ? "Sorry, this page does not exist" : "Sorry, something went wrong"}
					</Text>
					<Space size={6} />

					<Box className="flex flex-col gap-2">
						<Button
							variant={Button.variant.SMOOTH}
							className="inline-block border-b border-dashed border-zinc-700 pb-0.5 font-bold"
							onClick={handleGoToHomeClick}
						>
							Go to Home
						</Button>

						{is500Error && (
							<Button
								variant={Button.variant.SMOOTH}
								className="inline-block border-b border-dashed border-zinc-700 pb-0.5 font-bold"
								onClick={handleReloadPageClick}
							>
								Reload this page
							</Button>
						)}
					</Box>
				</Box>
			</MainLayout>
		</Page>
	);
}

export default ErrorPage;
