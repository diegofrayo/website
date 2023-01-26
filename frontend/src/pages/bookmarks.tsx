import { ENV_VARS } from "~/@legacy/src/constants";
import { getPageContentStaticProps } from "~/@legacy/src/features/i18n";
import BookmarksPage from "~/@legacy/src/features/pages/bookmarks";
import http from "~/@legacy/src/lib/http";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/@legacy/src/utils/objects-and-arrays";

export default BookmarksPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	callback: async () => ({
		props: {
			data: transformObjectKeysFromSnakeCaseToLowerCamelCase(
				(
					await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
						path: "/data",
						model: "bookmarks",
					})
				).data,
			),
		},
	}),
});
