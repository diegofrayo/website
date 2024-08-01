import * as React from "react";
import cn from "classnames";

import { Block, Icon, InlineText, Link } from "~/components/primitive";
import { ComponentWithAuth, withAuth } from "~/modules/auth";
import type { T_Song } from "@diegofrayo/types/kordz";
import { replaceAll } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

import { isChordsSong } from "../utils";

function SongDetails({ song, className = "" }: { song: T_Song; className?: string }) {
	if (isChordsSong(song)) {
		return null;
	}

	return (
		<Block className={cn("tw-text-sm tw-italic", className)}>
			{v.isNotEmptyString(song.artist) ? (
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
			) : null}
			{v.isNotEmptyString(song.album) ? (
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
			) : null}
			{song.year ? (
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
			) : null}
			<Category category={song.category} />

			<Block className="tw-mt-2 tw-flex tw-items-center">
				{v.isNotEmptyString(song.country) ? (
					<Block className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-py-0.5 tw-pl-0.5 tw-pr-0.5 dr-bg-color-surface-200 dr-border-color-surface-300 md:tw-pl-0 md:tw-pr-0">
						<InlineText className="tw-w-5 tw-text-center tw-text-sm tw-not-italic md:tw-text-xs">
							{song.country}
						</InlineText>
					</Block>
				) : null}
				{v.isNotEmptyString(song.spotify_url) && v.isNotEmptyString(song.youtube_url) ? (
					<Block className="tw-mx-2 tw-inline-flex tw-gap-2 tw-border-x tw-px-2 dr-border-color-surface-300">
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
				) : null}

				<Block className="tw-inline-flex tw-gap-2">
					{song.is_public ? null : (
						<ComponentWithAuth>
							<Icon
								icon={Icon.icon.EYE_SLASH}
								size={24}
								color="tw-text-gray-600"
							/>
						</ComponentWithAuth>
					)}
					{song.in_progress ? (
						<ComponentWithAuth>
							<Icon
								icon={Icon.icon.TOOL}
								size={24}
								color="tw-text-yellow-600"
							/>
						</ComponentWithAuth>
					) : null}
					{song.to_finish ? (
						<ComponentWithAuth>
							<Icon
								icon={Icon.icon.BATTERY_50}
								size={24}
								color="tw-text-orange-600"
							/>
						</ComponentWithAuth>
					) : (
						<ComponentWithAuth>
							<Icon
								icon={Icon.icon.CHECK_BADGE}
								size={24}
								color="tw-text-blue-600"
							/>
						</ComponentWithAuth>
					)}
				</Block>
			</Block>
		</Block>
	);
}

export default SongDetails;

// --- COMPONENTS ---

const Category = withAuth(function Category({ category }: { category: string }) {
	const [, categoryName, categoryEmoji] = category.split("|");

	return (
		<Block className="sm:tw-flex sm:tw-flex-nowrap">
			<InlineText
				is="strong"
				className="tw-mr-1"
			>
				Categoría:
			</InlineText>
			<InlineText>{categoryEmoji}</InlineText>
			<InlineText className="tw-ml-1 tw-capitalize">
				{replaceAll(categoryName, "_", " ").toLowerCase()}
			</InlineText>
		</Block>
	);
});
