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
								className="tw-flex tw-items-center tw-justify-center tw-rounded-md tw-border-8 tw-border-double dr-bg-color-surface-200 dr-border-color-surface-300 tw-wh-44"
							>
								<Link
									variant={Link.variant.SIMPLE}
									href={`/apps/${app.id}`}
									className="tw-block tw-text-center"
								>
									<Icon
										icon={app.icon}
										size={44}
									/>
									<Space size={1} />
									<Text className="tw-font-bold">{app.name}</Text>
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
		id: "experiments",
		icon: Icon.icon.BEAKER,
		name: "experiments",
	},
];
