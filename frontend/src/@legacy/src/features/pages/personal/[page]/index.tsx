import * as React from "react";
import dynamic from "next/dynamic";

import { Page, MainLayout } from "~/@legacy/src/components/layout";
import { Redirect } from "~/@legacy/src/components/shared";
import { withAuthPage } from "~/@legacy/src/features/auth";
import { ROUTES } from "~/@legacy/src/features/routing";
import v from "~/@legacy/src/lib/v";
import type { T_ReactElement } from "~/@legacy/src/types";

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
	// vars
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
