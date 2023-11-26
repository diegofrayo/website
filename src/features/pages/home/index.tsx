import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { InlineText, Link, Space, Block, Title } from "~/components/primitive";
import { Emoji, ProtectedComponent } from "~/components/shared";
import { AnalyticsService } from "~/features/analytics";
import { useTranslation } from "~/features/i18n";
import { ROUTES } from "~/features/routing";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement } from "~/types";

type T_HomeProps = {
	data: {
		featured: { text: string; url: string }[];
	};
};

function Home({ data }: T_HomeProps): T_ReactElement {
	// --- HOOKS ---
	const { t } = useTranslation();

	return (
		<Page
			config={{
				title: "",
				description: t("seo:description"),
				pathname: ROUTES.HOME,
				disableSEO: Boolean(t("page:config:is_seo_disabled")),
			}}
		>
			<MainLayout title="">
				<Block className="tw-mx-auto tw-w-72 tw-max-w-full">
					<Featured content={data.featured} />
				</Block>
			</MainLayout>
		</Page>
	);
}

export default Home;

// --- COMPONENTS ---

type T_Featured = {
	content: T_HomeProps["data"]["featured"];
};

function Featured({ content }: T_Featured): T_ReactElement {
	// --- HANDLERS ---
	function handleItemClick(itemText: string): () => void {
		return function onItemClickHandler() {
			AnalyticsService.trackEvent("HOME|FEATURED", { page: itemText });
		};
	}

	return (
		<ProtectedComponent>
			<Block
				is="section"
				className="tw-relative tw-rounded-t-md tw-border-8 tw-border-yellow-700 tw-bg-green-700 tw-p-4"
			>
				<Emoji className="tw-absolute tw--left-4 tw--top-4 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-text-sm dfr-shadow dfr-bg-color-gs-white">
					📌
				</Emoji>
				<Title
					is="h1"
					variant={Title.variant.UNSTYLED}
					className="tw-text-center dfr-text-color-gs-white"
					size={Title.size.MD}
				>
					FEATURED
				</Title>
				<Space size={2} />
				<Block className="tw-flex tw-flex-wrap tw-items-center tw-justify-between">
					{content.map((item, index) => {
						return (
							<Link
								key={generateSlug(item.text)}
								variant={Link.variant.SIMPLE}
								href={item.url}
								className={classNames(
									"tw-mt-3 tw-inline-block tw-text-sm tw-text-yellow-300",
									index % 2 === 0 ? "tw-rotate-1" : "tw--rotate-1",
								)}
								onClick={handleItemClick(item.text)}
							>
								<Emoji>🖇️</Emoji>
								<InlineText className="tw-mx-1 tw-underline">{item.text}</InlineText>
							</Link>
						);
					})}
				</Block>
			</Block>
		</ProtectedComponent>
	);
}
