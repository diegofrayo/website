import * as React from "react";

import { T_IconName } from "~/components/primitive/Icon";
import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Icon, InlineText, Space, List } from "~/components/primitive";
import { withAuthPage } from "~/features/auth";
import { ROUTES } from "~/features/routing";
import type { T_ReactElement } from "~/types";

import { PERSONAL_PAGES } from "./constants";

function PersonalPage(): T_ReactElement {
	// --- VARS ---
	const PAGE_TITLE = "Personal";

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
			}}
		>
			<MainLayout title={PAGE_TITLE}>
				<Block className="tw-w-full sm:tw-mx-auto sm:tw-max-w-md">
					<PagesList pages={PERSONAL_PAGES.filter((page) => page.type === "DATA")} />
					<Space
						size={4}
						variant={Space.variant.DASHED}
					/>
					<PagesList pages={PERSONAL_PAGES.filter((page) => page.type === "TOOL")} />
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthPage(PersonalPage);

// --- COMPONENTS ---

type T_PagesListProps = {
	pages: { slug: string; title: string; icon: T_IconName }[];
};

function PagesList({ pages }: T_PagesListProps): T_ReactElement {
	return (
		<List variant={List.variant.UNSTYLED}>
			{pages.map((page) => {
				return (
					<List.Item key={page.slug}>
						<Link
							variant={Link.variant.SECONDARY}
							href={`${ROUTES.PERSONAL}/${page.slug}`}
							className="tw-my-2 tw-flex tw-h-20 tw-items-center tw-justify-between tw-border tw-border-dotted tw-p-2 dfr-border-color-primary"
						>
							<Icon
								icon={Icon.icon[page.icon]}
								color="dfr-text-color-bw"
								size={32}
							/>
							<InlineText className="tw-mx-2 tw-flex-1 tw-truncate tw-text-center">
								{page.title}
							</InlineText>
							<Icon
								icon={Icon.icon[page.icon]}
								color="dfr-text-color-bw"
								size={32}
							/>
						</Link>
					</List.Item>
				);
			})}
		</List>
	);
}
