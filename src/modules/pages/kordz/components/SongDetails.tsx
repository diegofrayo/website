import * as React from "react";
import cn from "classnames";

import { Block, Icon, InlineText, Link, Space } from "~/components/primitive";
import { withAuth } from "~/modules/auth";
import type { T_Song } from "@diegofrayo/types/kordz";
import { safeCastNumber } from "@diegofrayo/utils/numbers";
import { replaceAll } from "@diegofrayo/utils/strings";

import { isChordsSong } from "../utils";

function SongDetails({ song, className = "" }: { song: T_Song; className?: string }) {
	if (isChordsSong(song)) {
		return null;
	}

	return (
		<Block className={cn("tw-text-sm tw-italic", className)}>
			<Block className="sm:tw-flex sm:tw-flex-nowrap">
				<InlineText
					is="strong"
					className="tw-mr-1"
				>
					Artista:
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
					Álbum:
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
					Año:
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
				<Block className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-py-0.5 tw-pl-0.5 tw-pr-0.5 dr-border-color-surface-300 md:tw-pl-0 md:tw-pr-0">
					<InlineText className="tw-w-5 tw-text-center tw-text-sm tw-not-italic md:tw-text-xs">
						{song.country}
					</InlineText>
				</Block>

				<Block className="tw-ml-2 tw-inline-block tw-border-l tw-pl-2 dr-border-color-surface-300">
					<Link
						variant={Link.variant.SIMPLE}
						href={song.spotify_url}
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
						href={song.youtube_url}
						isExternalLink
					>
						<Icon
							icon={Icon.icon.YOUTUBE}
							size={24}
						/>
					</Link>
				</Block>

				{song.done ? (
					<Block className="tw-ml-2 tw-inline-block tw-border-l tw-pl-2 dr-border-color-surface-300">
						<Icon
							icon={Icon.icon.CHECK_BADGE}
							size={24}
							color="tw-text-blue-500"
						/>
					</Block>
				) : null}
			</Block>
		</Block>
	);
}

export default SongDetails;

// --- COMPONENTS ---

const Category = withAuth(function Category({ category }: { category: string }) {
	// --- VARS ---
	const EMOJIS = ["🚧", "⭐", "👌", "🤷‍♂️", "👷"];

	return (
		<Block className="sm:tw-flex sm:tw-flex-nowrap">
			<InlineText
				is="strong"
				className="tw-mr-1"
			>
				Categoría:
			</InlineText>
			<InlineText>{EMOJIS[safeCastNumber(category.split("|")[0], 0)]}</InlineText>
			<InlineText className="tw-ml-1 tw-capitalize">
				{replaceAll(category.split("|")[1], "_", " ").toLowerCase()}
			</InlineText>
		</Block>
	);
});
