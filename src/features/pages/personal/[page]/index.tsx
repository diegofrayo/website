import * as React from "react";
import dynamic from "next/dynamic";

import { Page, MainLayout } from "~/components/layout";
import { Redirect } from "~/components/shared";
import { withAuth } from "~/features/auth";
import { ROUTES } from "~/features/routing";
import { isUndefined, isNotEmptyString } from "~/utils/validations";
import type { T_ReactElement } from "~/types";

import { PERSONAL_PAGES } from "../constants";

const PERSONAL_PAGES_COMPONENTS = PERSONAL_PAGES.filter((page) => {
	return isNotEmptyString(page.componentName);
}).map((page) => {
	return {
		...page,
		Component: dynamic(() => import(`./${page.componentName}`)),
	};
});

type T_PersonalPageProps = {
	page: string;
};

function PersonalPage({ page }: T_PersonalPageProps): T_ReactElement {
	// vars
	const pageConfig = PERSONAL_PAGES_COMPONENTS.find((item) => item.slug === page);

	if (isUndefined(pageConfig)) {
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

export default withAuth<T_PersonalPageProps>(PersonalPage, {
	allowIf: (props) => ["films"].includes(props.page),
});
