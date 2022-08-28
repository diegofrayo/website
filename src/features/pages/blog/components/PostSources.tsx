import * as React from "react";

import { Link, List, Title, Block, Text } from "~/components/primitive";
import { useTranslation } from "~/features/i18n";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement } from "~/types";

function PostSources({ sources }: { sources: { title: string; url: string }[] }): T_ReactElement {
	// hooks
	const { t } = useTranslation();

	return (
		<Block
			is="section"
			variant="FEATURED"
			className="tw-mt-16 tw-pl-6"
		>
			<Title
				is="h2"
				className="tw-mb-3"
				showLinkIcon
			>
				{t("page:sources")}
			</Title>
			<List variant={List.variant.DEFAULT}>
				{sources.map((source) => {
					const { host } = new URL(source.url);

					return (
						<List.Item key={generateSlug(source.title)}>
							<Link
								variant={Link.variant.PRIMARY}
								href={source.url}
								isExternalLink
							>
								{source.title}
							</Link>
							<Text className="tw-text-xs tw-font-bold tw-italic dfr-text-color-bw">{host}</Text>
						</List.Item>
					);
				})}
			</List>
		</Block>
	);
}

export default PostSources;
