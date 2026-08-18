export function encodeRequestParams(body: Record<string, string | number>): string {
	const queryParams = Object.entries(body)
		.reduce((result: string[], [key, value]) => {
			return [...result, `${key}=${encodeURIComponent(String(value))}`];
		}, [])
		.join("&");

	return queryParams;
}

export function goBack(): void {
	window.history.back();
}
