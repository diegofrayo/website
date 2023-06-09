import * as React from "react";

import { Icon, Image, Link, List, Block, Text } from "~/components/primitive";
import { useTranslation } from "~/features/i18n";
import v from "~/lib/v";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElementNullable } from "~/types";

import { T_Song } from "../service";

type T_SongSourcesProps = {
	sources: T_Song["sources"];
};

function SongSources({ sources }: T_SongSourcesProps): T_ReactElementNullable {
	// --- HOOKS ---
	const { t } = useTranslation();

	if (v.isEmptyArray(sources)) {
		return null;
	}

	return (
		<Block className="tw-border tw-border-yellow-200 tw-bg-yellow-50 tw-p-4 dark:tw-border-gray-600 dark:tw-bg-gray-700">
			<Text className="tw-mb-3 tw-text-sm tw-italic">{t("page:disclaimer")}</Text>

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
										className="tw-mr-2 tw-rounded-full"
										width={32}
										height={32}
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
										size={32}
										wrapperClassName="tw-mr-2"
									/>
								)}
								<Block className="tw-min-w-0 tw-flex-1">
									<Text
										className="tw-truncate tw-text-sm tw-font-bold dfr-text-color-gs-black dark:dfr-text-color-gs-white"
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
