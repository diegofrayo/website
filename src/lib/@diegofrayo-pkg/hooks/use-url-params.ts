import { useEffect, useState } from "react";

export default function useUrlParams(): URLSearchParams {
	const [params, setParams] = useState(() => new URLSearchParams(window.location.search));

	useEffect(() => {
		const handlePopState = (): void => {
			setParams(new URLSearchParams(window.location.search));
		};

		// Listens to browser back/forward buttons
		window.addEventListener("popstate", handlePopState);

		return (): void => window.removeEventListener("popstate", handlePopState);
	}, []);

	return params;
}
