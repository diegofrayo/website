// @ts-nocheck

import * as React from "react";
import dynamic from "next/dynamic";

import { Page, MainLayout } from "~/components/layout";
import { Redirect } from "~/components/shared";
import { withAuthPage } from "~/features/auth";
import { ROUTES } from "~/features/routing";
import v from "~/lib/v";
import type { T_ReactElement } from "~/types";

/*
// NOTE: It doesn't work, here is the explanation (because of css-modules)
// https://github.com/vercel/next.js/issues/31271#issuecomment-965969089
const PERSONAL_PAGES_COMPONENTS = PERSONAL_PAGES.filter((page) => {
	return v.isNotEmptyString(page.componentName);
}).map((page) => {
	return {
		...page,
		Component: dynamic(() => import(`./${page.componentName}`)),
	};
});
*/

const PERSONAL_PAGES_COMPONENTS = [
	// personal
	{
		slug: "films",
		title: "films",
		Component: dynamic(() => import("./films/index")),
	},
	{
		slug: "timeline",
		title: "timeline",
		Component: dynamic(() => import("./timeline/index")),
	},
	{
		slug: "books",
		title: "books",
		Component: dynamic(() => import("./books/index")),
	},

	// tools
	{
		slug: "whatsapp",
		title: "whatsapp",
		Component: dynamic(() => import("./WhatsApp")),
	},
	{
		slug: "dencrypt",
		title: "dencrypt",
		Component: dynamic(() => import("./Dencrypt")),
	},
	{
		slug: "text",
		title: "text",
		Component: dynamic(() => import("./Text")),
	},
	{
		slug: "isr",
		title: "isr",
		Component: dynamic(() => import("./ISR")),
	},
	{
		slug: "debugging",
		title: "debugging",
		Component: dynamic(() => import("./Debugging")),
	},
	{
		slug: "thumbnails",
		title: "thumbnails",
		Component: dynamic(() => import("./Thumbnails")),
	},
];

type T_PersonalPageProps = {
	page: string;
};

function PersonalPage({ page }: T_PersonalPageProps): T_ReactElement {
	// --- VARS ---
	const pageConfig = PERSONAL_PAGES_COMPONENTS.find((item) => item.slug === page);

	if (v.isUndefined(pageConfig)) {
		return <Redirect href={ROUTES.ERROR_404} />;
	}

	const { title, Component } = pageConfig;

	return (
		<Page
			config={{
				title,
				disableSEO: true,
			}}
		>
			<MainLayout title={title}>
				<Component />
			</MainLayout>
		</Page>
	);
}

export default withAuthPage<T_PersonalPageProps>(PersonalPage, {
	allowIf: (props) => ["films"].includes(props.page),
});
