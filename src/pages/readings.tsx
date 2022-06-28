import ReadingsPage from "~/components/pages/readings";
import { getPageContentStaticProps } from "~/i18n";
import http from "~/lib/http";
import { ENV_VARS } from "~/utils/constants";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";

export default ReadingsPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
	callback: async () => ({
		props: {
			data: transformObjectKeysFromSnakeCaseToLowerCamelCase(
				(
					await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
						path: "/data",
						model: "readings",
					})
				).data,
			),
		},
	}),
});
