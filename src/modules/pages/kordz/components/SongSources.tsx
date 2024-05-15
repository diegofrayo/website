import * as React from "react";

import { Icon, Image, Link, List, Block, Text, Title, Space } from "~/components/primitive";
import type { T_Song } from "@diegofrayo/types/kordz";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

type T_SongSourcesProps = {
	sources: T_Song["sources"];
};

function SongSources({ sources }: T_SongSourcesProps) {
	if (v.isEmptyArray(sources)) {
		return null;
	}

	return (
		<Block
			is="section"
			className="tw-rounded-md tw-p-4 dr-text-color-primary-600 dr-bg-color-surface-mixed-400"
		>
			<Title
				is="h3"
				className="tw-text-white"
				size={Title.size.MD}
			>
				Fuentes
			</Title>
			<Space size={1} />

			<Text className="tw-text-base">
				Esta transcripción está basada en el contenido de los siguientes enlaces:
			</Text>
			<Space size={1} />

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
										src="/assets/images/pages/kordz/lacuerda.png"
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
										className="tw-truncate tw-text-sm tw-font-bold"
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
