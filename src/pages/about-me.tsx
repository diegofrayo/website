import * as React from "react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Page, MainLayout } from "~/components/layout";
import { MDXContent } from "~/components/shared";
import http from "~/lib/http";
import { useTranslation, getPageContentStaticProps } from "~/i18n";
import { ROUTES } from "~/utils/routing";
import { MDXScope } from "~/utils/mdx";
import { ENV_VARS } from "~/utils/constants";
import type { T_ReactElement } from "~/types";

type T_AboutMePageProps = {
	pageMDXContent: MDXRemoteSerializeResult;
};

function AboutMePage({ pageMDXContent }: T_AboutMePageProps): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	return (
		<Page
			config={{
				title: t("seo:title"),
				description: t("seo:description"),
				pathname: ROUTES.ABOUT_ME,
				disableSEO: Boolean(t("page:config:is_seo_disabled")),
			}}
		>
			<MainLayout title={t("seo:title")}>
				<MDXContent
					variant={MDXContent.variant.UNSTYLED}
					content={pageMDXContent}
				/>
			</MainLayout>
		</Page>
	);
}

export default AboutMePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps<T_AboutMePageProps, { page: string }>({
	page: ROUTES.ABOUT_ME,
	callback: async () => {
		const fileURL = (
			await http.post(`${ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
				path: "/about-me",
			})
		).data;
		const file = (await http.get(fileURL)).data;

		const pageMDXContent = await serialize(file, {
			scope: {
				DATA: MDXScope.DATA,
			},
		});

		return {
			props: {
				pageMDXContent,
			},
		};
	},
});
