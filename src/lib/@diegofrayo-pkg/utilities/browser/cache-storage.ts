export async function clearCacheStorage(): Promise<boolean[]> {
	const cacheKeys = await window.caches.keys();

	return Promise.all(
		cacheKeys.map((key) => {
			return window.caches.delete(key);
		}),
	);
}
