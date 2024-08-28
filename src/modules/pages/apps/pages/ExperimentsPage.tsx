import * as React from "react";

import { Page } from "~/components/layout";
import { Block, Link, Title } from "~/components/primitive";
import { TypingTextEffect } from "~/components/shared";
import WEBSITE_METADATA from "~/data/metadata.json";
import { withAuthRulesPage } from "~/modules/auth";
import { ROUTES } from "~/modules/routing";

function ExperimentsPage() {
	return (
		<Page
			config={{
				title: "Experiments",
				disableSEO: true,
			}}
		>
			<Block className="tw-py-[375px] tw-text-center">
				<Title
					is="h1"
					className="tw-relative tw-left-4 tw-inline-block"
				>
					<Link
						variant={Link.variant.SIMPLE}
						href={ROUTES.HOME}
						className="tw-block tw-text-2xl tw-text-white dr-font-main-title sm:tw-text-4xl"
					>
						{`@${WEBSITE_METADATA.username}`}
					</Link>
					<TypingTextEffect className="tw-font-mono tw-text-sm tw-font-thin">
						{WEBSITE_METADATA.jobTitle.toLowerCase()}
					</TypingTextEffect>
				</Title>
			</Block>
		</Page>
	);
}

export default withAuthRulesPage(ExperimentsPage, {
	requireAuth: true,
	roles: ["ADMIN"],
});
