import { GetStaticPaths } from "next";

import { getPageContentStaticProps } from "~/features/i18n";
import PersonalPage from "~/features/pages/personal/[page]";
import { PERSONAL_PAGES } from "~/features/pages/personal";
import { isNotEmptyString } from "~/utils/validations";

export default PersonalPage;

// --- Next.js functions ---

type T_PageProps = { page: string };

export const getStaticPaths: GetStaticPaths<T_PageProps> = async function getStaticPaths() {
	return {
		paths: PERSONAL_PAGES.filter((page) => {
			return isNotEmptyString(page.componentName);
		}).map((page) => {
			return {
				params: { page: page.slug },
			};
		}),
		fallback: false,
	};
};

export const getStaticProps = getPageContentStaticProps<T_PageProps, T_PageProps>({
	callback: async ({ params }) => {
		return {
			props: {
				page: params.page,
			},
		};
	},
});
