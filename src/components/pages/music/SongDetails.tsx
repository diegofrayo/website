import React from "react";
import classNames from "classnames";

import { Icon, Link, Block, Text, InlineText } from "~/components/primitive";
import { protectedComponent } from "~/hocs";
import { useTranslation } from "~/i18n";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
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
        <strong>{t("page:artist")}:</strong>{" "}
        <InlineText className="sm:tw-ml-1 sm:tw-truncate sm:tw-flex-1" title={song.artist}>
          {song.artist}
        </InlineText>
      </Block>
      <Block className="sm:tw-flex sm:tw-flex-nowrap">
        <strong>{t("page:album")}:</strong>{" "}
        <InlineText className="sm:tw-ml-1 sm:tw-truncate sm:tw-flex-1" title={song.album}>
          {song.album}
        </InlineText>
      </Block>
      <Block>
        <strong>{t("page:year")}:</strong> <InlineText>{song.year}</InlineText>
      </Block>
      <Progress progress={song.progress} />
      <Text className="tw-text-lg tw--mt-1">{song.country}</Text>
      <Block className="tw-flex tw-items-center tw-mt-1">
        <Link href={song.spotifyUrl} variant={Link.variant.SIMPLE} className="tw-mr-2">
          <Icon icon={Icon.icon.SPOTIFY} size={24} />
        </Link>
        <Link href={song.youtubeUrl} variant={Link.variant.SIMPLE}>
          <Icon icon={Icon.icon.YOUTUBE} size={24} />
        </Link>
      </Block>
    </Block>
  );
}

export default SongDetails;

// --- Components ---

const Progress = protectedComponent(function Progress({ progress }: { progress: number }) {
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
      : "tw-opacity-75 dfr-bg-secondary";
  }

  return (
    <Block className={classNames("tw-flex tw-items-center")}>
      <strong className="tw-mr-2">{t("page:progress")}:</strong>
      {createArray(5).map((index) => {
        return (
          <InlineText
            key={`Progress-item-${index}`}
            className={classNames(
              "tw-inline-block tw-rounded-sm tw-h-3 tw-w-3 tw-mr-0.5",
              getProgressStyles(progress, index),
            )}
          />
        );
      })}
    </Block>
  );
});
