"use client";

import { useRouter } from "next/navigation";

import { MainLayout } from "~/components/layout";
import { Box, Button, Paragraph, Space, Title } from "~/components/primitive";

type ErrorPageProps = {
	variant: "404" | "500";
	onRetry?: () => void;
};

function ErrorPage({ variant, onRetry }: ErrorPageProps) {
	// --- HOOKS ---
	const router = useRouter();

	// --- COMPUTED STATES ---
	const is404Error = variant === "404";

	// -- HANDLERS ---
	function handleGoToHomeClick() {
		router.push("/");
	}

	return (
		<MainLayout>
			<Box className="flex min-h-[80vh] flex-col items-center justify-center text-center">
				<Paragraph className="text-10xl mb-4 leading-none">{is404Error ? "👀" : "🙉"}</Paragraph>
				<Title
					as="h1"
					size={Title.size.LG}
				>
					{is404Error ? "404 " : ""}ERROR
				</Title>
				<Paragraph>
					{is404Error ? "Sorry, this page does not exist" : "Sorry, something went wrong"}
				</Paragraph>
				<Space size={6} />

				<Box className="flex flex-col gap-2">
					{onRetry && (
						<Button
							variant={Button.variant.SMOOTH}
							className="inline-block border-b border-dashed border-zinc-700 pb-0.5 font-bold"
							onClick={onRetry}
						>
							Try again
						</Button>
					)}
					<Button
						variant={Button.variant.SMOOTH}
						className="inline-block border-b border-dashed border-zinc-700 pb-0.5 font-bold"
						onClick={handleGoToHomeClick}
					>
						Go to Home
					</Button>
				</Box>
			</Box>
		</MainLayout>
	);
}

export default ErrorPage;
