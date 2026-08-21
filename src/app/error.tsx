"use client";

import { useEffect } from "react";

import logger from "~/features/logger";
import ErrorPage from "~/features/pages/error.page";

type ErrorProps = {
	error: Error & { digest?: string };
	retry: () => void;
};

function Error({ error, retry }: ErrorProps) {
	// --- EFFECTS ---
	useEffect(() => {
		logger("ERROR", error);
	}, [error]);

	return (
		<ErrorPage
			variant="500"
			onRetry={retry}
		/>
	);
}

export default Error;
