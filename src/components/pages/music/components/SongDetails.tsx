import * as React from "react";
import classNames from "classnames";

import { Icon, Link, Block, Text, InlineText, Space } from "~/components/primitive";
import { withRequiredAuthComponent } from "~/hocs";
import { useTranslation } from "~/i18n";
import MusicService from "~/services/music";
import type { T_ReactElement, T_Song } from "~/types";
import { createArray } from "~/utils/misc";

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
      <Progress progress={song.progress} />
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

const Progress = withRequiredAuthComponent(function Progress({ progress }: { progress: number }) {
  const { t } = useTranslation();

  function getProgressStyles(progress: number, index: number) {
    return index <= progress
      ? (progress === 1
          ? {
              1: "tw-bg-red-500",
            }
          : progress === 2
          ? {
              1: "tw-bg-yellow-400",
              2: "tw-bg-yellow-500",
            }
          : progress === 3
          ? {
              1: "tw-bg-yellow-300",
              2: "tw-bg-yellow-400",
              3: "tw-bg-yellow-500",
            }
          : progress === 4
          ? {
              1: "tw-bg-green-300",
              2: "tw-bg-green-400",
              3: "tw-bg-green-500",
              4: "tw-bg-green-600",
            }
          : {
              1: "tw-bg-green-300",
              2: "tw-bg-green-400",
              3: "tw-bg-green-500",
              4: "tw-bg-green-600",
              5: "tw-bg-green-700",
            })[index]
      : "tw-opacity-75 dfr-bg-color-primary";
  }

  return (
    <Block className={classNames("tw-flex tw-items-center")}>
      <InlineText is="strong" className="tw-mr-2">
        {t("page:progress")}:
      </InlineText>
      {createArray(5).map((index) => {
        return (
          <InlineText
            key={`Progress-item-${index}`}
            className={classNames(
              "tw-mr-0.5 tw-inline-block tw-h-3 tw-w-3",
              getProgressStyles(progress, index),
            )}
          />
        );
      })}
    </Block>
  );
});
