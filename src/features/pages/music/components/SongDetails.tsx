import * as React from "react";
import classNames from "classnames";

import { Icon, Link, Block, InlineText, Space } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { withAuthComponent } from "~/features/auth";
import { useTranslation } from "~/features/i18n";
import { safeCastNumber } from "~/utils/numbers";
import { replaceAll } from "~/utils/strings";
import type { T_ReactElementNullable } from "~/types";

import MusicService, { T_Song } from "../service";

function SongDetails({
	song,
	className = "",
}: {
	song: T_Song;
	className?: string;
}): T_ReactElementNullable {
	// hooks
	const { t } = useTranslation();

	if (MusicService.isChordsSong(song)) {
		return null;
	}

	return (
		<Block className={classNames("tw-text-sm tw-italic", className)}>
			<Block className="sm:tw-flex sm:tw-flex-nowrap">
				<InlineText
					is="strong"
					className="tw-mr-1"
				>
					{t("page:artist")}:
				</InlineText>
				<InlineText
					className="sm:tw-flex-1 sm:tw-truncate"
					title={song.artist}
				>
					{song.artist}
				</InlineText>
			</Block>
			<Block className="sm:tw-flex sm:tw-flex-nowrap">
				<InlineText
					is="strong"
					className="tw-mr-1"
				>
					{t("page:album")}:
				</InlineText>
				<InlineText
					className="sm:tw-flex-1 sm:tw-truncate"
					title={song.album}
				>
					{song.album}
				</InlineText>
			</Block>
			<Block className="sm:tw-flex sm:tw-flex-nowrap">
				<InlineText
					is="strong"
					className="tw-mr-1"
				>
					{t("page:year")}:
				</InlineText>
				<InlineText
					className="sm:tw-flex-1 sm:tw-truncate"
					title={`${song.year}`}
				>
					{song.year}
				</InlineText>
			</Block>
			<Category category={song.category} />

			<Block className="tw-mt-2 tw-flex tw-items-center">
				<Block className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-py-0.5 tw-pl-0.5 tw-pr-0.5 dfr-border-color-primary md:tw-pl-0 md:tw-pr-0">
					<InlineText className="tw-w-5 tw-text-center tw-text-sm tw-not-italic md:tw-text-xs">
						{song.country}
					</InlineText>
				</Block>

				<Block className="tw-ml-2 tw-inline-block tw-border-l tw-pl-2 dfr-border-color-primary">
					<Link
						variant={Link.variant.SIMPLE}
						href={song.spotifyUrl}
						isExternalLink
					>
						<Icon
							icon={Icon.icon.SPOTIFY}
							size={24}
						/>
					</Link>
					<Space
						size={1}
						orientation="v"
					/>
					<Link
						variant={Link.variant.SIMPLE}
						href={song.youtubeUrl}
						isExternalLink
					>
						<Icon
							icon={Icon.icon.YOUTUBE}
							size={24}
						/>
					</Link>
				</Block>
			</Block>
		</Block>
	);
}

export default SongDetails;

// --- Components ---

const Category = withAuthComponent(function Category({ category }: { category: string }) {
	// hooks
	const { t } = useTranslation();

	// vars
	const EMOJIS = ["🚧", "⭐", "🟨", "🟥"];

	return (
		<Block className="sm:tw-flex sm:tw-flex-nowrap">
			<InlineText
				is="strong"
				className="tw-mr-1"
			>
				{t("page:category")}:
			</InlineText>
			<Emoji>{EMOJIS[safeCastNumber(category.split("|")[0])]}</Emoji>
			<InlineText className="tw-ml-1 tw-capitalize">
				{replaceAll(category.split("|")[1], "_", " ").toLowerCase()}
			</InlineText>
		</Block>
	);
});