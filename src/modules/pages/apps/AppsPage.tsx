import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Block, Icon, Link, Space, Text } from "~/components/primitive";
import { withAuthRulesPage } from "~/modules/auth";

function AppsPage() {
	return (
		<Page
			config={{
				title: "Apps",
				disableSEO: true,
			}}
		>
			<MainLayout title="Apps">
				<Block className="tw-flex tw-flex-row tw-flex-wrap tw-justify-center tw-gap-4">
					{APPS.map((app) => {
						return (
							<Block
								key={app.id}
								className="tw-rounded-md tw-border-8 tw-border-double dr-bg-color-surface-200 dr-border-color-surface-300"
							>
								<Link
									variant={Link.variant.SIMPLE}
									href={`/apps/${app.id}`}
									className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-wh-32 sm:tw-wh-44"
								>
									<Icon
										icon={app.icon}
										size={44}
										color="inherit"
									/>
									<Space size={1} />
									<Text className="tw-text-sm tw-font-bold sm:tw-text-base">{app.name}</Text>
								</Link>
							</Block>
						);
					})}
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(AppsPage, { requireAuth: true });

// --- COMPONENTS ---

const APPS = [
	{
		id: "contacts",
		icon: Icon.icon.USER_CIRCLE,
		name: "contacts",
	},
	{
		id: "businesses",
		icon: Icon.icon.STORE,
		name: "businesses",
	},
	{
		id: "films",
		icon: Icon.icon.FILM,
		name: "films",
	},
	{
		id: "dencrypt",
		icon: Icon.icon.KEY,
		name: "dencrypt",
	},
	{
		id: "whatsapp",
		icon: Icon.icon.WHATSAPP_MONO,
		name: "whatsapp",
	},
	{
		id: "debugger",
		icon: Icon.icon.CODE,
		name: "debugger",
	},
	{
		id: "series",
		icon: Icon.icon.EDIT,
		name: "series",
	},
	{
		id: "stopwatch",
		icon: Icon.icon.CLOCK,
		name: "stopwatch",
	},
	{
		id: "ticks",
		icon: Icon.icon.HEART,
		name: "ticks",
	},
	{
		id: "books",
		icon: Icon.icon.BOOK,
		name: "books",
	},
	{
		id: "timeline",
		icon: Icon.icon.PRESENTATION_CHART_LINE,
		name: "timeline",
	},
	{
		id: "experiments",
		icon: Icon.icon.BEAKER,
		name: "experiments",
	},
];
