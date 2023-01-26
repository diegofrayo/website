import * as React from "react";

import { MainLayout, Page } from "~/@legacy/src/components/layout";
import { Text } from "~/@legacy/src/components/primitive";
import { useTranslation } from "~/@legacy/src/features/i18n";
import type { T_ReactElement } from "~/@legacy/src/types";

function ErrorPage(): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	return (
		<Page
			config={{
				title: t("page:title"),
				disableSEO: true,
			}}
		>
			<MainLayout title={t("page:title")}>
				<Text className="tw-text-center">{t("page:body")}</Text>
			</MainLayout>
		</Page>
	);
}

export default ErrorPage;
