import * as React from "react";

import { Icon, Image, Link, List, Title, Block, Text } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import type { T_ReactElementNullable } from "~/types";
import { generateSlug } from "~/utils/strings";

import { T_Song } from "../service";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_SongSourcesProps = {
	sources: T_Song["sources"];
};

function SongSources({ sources }: T_SongSourcesProps): T_ReactElementNullable {
	// hooks
	const { t } = useTranslation();

	// render
	if (sources.length === 0) {
		return null;
	}

	return (
		<Block>
			<Title is="h2">{t("page:sources")}</Title>

			<Text className="tw-my-2 tw-text-sm tw-italic">{t("page:disclaimer")}</Text>

			<List variant={List.variant.UNSTYLED}>
				{sources.map((item) => {
					return (
						<List.Item
							key={generateSlug(item.url)}
							className="tw-mb-2 last:tw-mb-0"
						>
							<Link
								variant={Link.variant.SIMPLE}
								href={item.url}
								className="tw-flex tw-items-center tw-py-0.5"
								isExternalLink
							>
								{item.source.includes("lacuerda") ? (
									<Image
										src="/static/images/misc/lacuerda.png"
										alt="La cuerda icon"
										className="tw-mr-2 tw-h-8 tw-w-8 tw-rounded-full"
									/>
								) : (
									<Icon
										icon={
											item.source === "youtube"
												? Icon.icon.YOUTUBE
												: item.source === "spotify"
												? Icon.icon.SPOTIFY
												: item.source === "instagram"
												? Icon.icon.INSTAGRAM
												: Icon.icon.LINK
										}
										size="tw-w-8 tw-h-8"
										wrapperClassName="tw-mr-2"
									/>
								)}
								<Block className="tw-min-w-0 tw-flex-1">
									<Text
										className="tw-truncate tw-text-sm tw-font-bold tw-text-black dark:tw-text-white"
										title={item.text}
									>
										{item.text}
									</Text>
									<Text className="tw-text-xs tw-italic">{item.source}</Text>
								</Block>
							</Link>
						</List.Item>
					);
				})}
			</List>
		</Block>
	);
}

export default SongSources;
