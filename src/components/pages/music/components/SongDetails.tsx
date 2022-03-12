import * as React from "react";
import classNames from "classnames";

import { Icon, Link, Block, Text, InlineText, Space } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { withRequiredAuthComponent } from "~/hocs";
import { useTranslation } from "~/i18n";
import MusicService from "~/services/music";
import type { T_ReactElement, T_Song } from "~/types";

function SongDetails({
  song,
  className = "",
}: {
  song: T_Song;
  className?: string;
}): T_ReactElement {
  const { t } = useTranslation();

  if (MusicService.isChordsPage(song)) return null;

  return (
    <Block className={classNames("tw-text-sm tw-italic", className)}>
      <Block className="sm:tw-flex sm:tw-flex-nowrap">
        <InlineText is="strong">{t("page:artist")}:</InlineText>{" "}
        <InlineText className="sm:tw-ml-1 sm:tw-flex-1 sm:tw-truncate" title={song.artist}>
          {song.artist}
        </InlineText>
      </Block>
      <Block className="sm:tw-flex sm:tw-flex-nowrap">
        <InlineText is="strong">{t("page:album")}:</InlineText>{" "}
        <InlineText className="sm:tw-ml-1 sm:tw-flex-1 sm:tw-truncate" title={song.album}>
          {song.album}
        </InlineText>
      </Block>
      <Block>
        <InlineText is="strong">{t("page:year")}:</InlineText> <InlineText>{song.year}</InlineText>
      </Block>
      <Category category={song.category} />
      <Text className="tw--mt-1 tw-text-lg">{song.country}</Text>
      <Block className="tw--mt-0.5 tw-flex tw-items-center">
        <Link variant={Link.variant.SIMPLE} href={song.spotifyUrl} isExternalUrl>
          <Icon icon={Icon.icon.SPOTIFY} size={24} />
        </Link>
        <Space size={1} orientation="v" />
        <Link variant={Link.variant.SIMPLE} href={song.youtubeUrl} isExternalUrl>
          <Icon icon={Icon.icon.YOUTUBE} size={24} />
        </Link>
      </Block>
    </Block>
  );
}

export default SongDetails;

// --- Components ---

const Category = withRequiredAuthComponent(function Category({ category }: { category: string }) {
  const { t } = useTranslation();

  const EMOJIS = ["🟦", "🟩", "🟨", "⬛", "⬜", "🟥"];

  return (
    <Block className={classNames("tw-flex tw-items-center")}>
      <InlineText is="strong" className="tw-mr-2">
        {t("page:category")}:
      </InlineText>
      <Emoji>{EMOJIS[category.split("|")[0]]}</Emoji>
      <InlineText className="tw-ml-2 tw-capitalize">
        {category.split("|")[1].replace("_", " ").toLowerCase()}
      </InlineText>
    </Block>
  );
});
