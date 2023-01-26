import * as React from "react";

import { Link, List, Title, Block, Text } from "~/@legacy/src/components/primitive";
import { useTranslation } from "~/@legacy/src/features/i18n";
import v from "~/@legacy/src/lib/v";
import { generateSlug } from "~/@legacy/src/utils/strings";
import type { T_ReactElementNullable } from "~/@legacy/src/types";

function PostSources({
	sources,
}: {
	sources: { title: string; url: string }[];
}): T_ReactElementNullable {
	// hooks
	const { t } = useTranslation();

	if (v.isEmptyArray(sources)) {
		return null;
	}

	return (
		<Block
			is="section"
			className="tw-mt-12 tw-border tw-border-yellow-200 tw-bg-yellow-50 tw-p-4 dark:tw-border-gray-600 dark:tw-bg-gray-700"
		>
			<Title
				is="h2"
				className="tw-mb-3"
			>
				🔗 {t("page:sources")}
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
