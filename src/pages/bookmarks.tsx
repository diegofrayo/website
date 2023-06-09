import { ENV_VARS } from "~/constants";
import { getPageContentStaticProps } from "~/features/i18n";
import BookmarksPage from "~/features/pages/bookmarks";
import http from "~/lib/http";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";

export default BookmarksPage;

// --- NEXT.JS FUNCTIONS ---

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
