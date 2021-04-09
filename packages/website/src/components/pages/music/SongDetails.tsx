import React from "react";
import classNames from "classnames";

import { Icon, Link } from "~/components/primitive";
import { T_SiteTexts, T_Song } from "~/types";
import { createArray } from "~/utils/misc";

function SongDetails({
  song,
  SiteTexts,
  className,
}: {
  song: T_Song;
  SiteTexts: T_SiteTexts;
  className?: string;
}): JSX.Element {
  const { getProgressStyles } = useController();

  return (
    <div className={classNames("tw-text-sm tw-italic", className)}>
      <div>
        <strong>{SiteTexts.page.current_locale.artist}:</strong> <span>{song.artist}</span>
      </div>
      <div>
        <strong>{SiteTexts.page.current_locale.album}:</strong> <span>{song.album}</span>
      </div>
      <div>
        <strong>{SiteTexts.page.current_locale.year}:</strong> <span>{song.year}</span>
      </div>
      <div className="tw-flex tw-items-center">
        <strong className="tw-mr-2">{SiteTexts.page.current_locale.progress}:</strong>
        {createArray(5).map(index => {
          return (
            <span
              key={`Progress-item-${index}`}
              className={classNames(
                "tw-inline-block tw-rounded-sm tw-h-3 tw-w-3 tw-mr-0.5",
                getProgressStyles(song, index),
              )}
            />
          );
        })}
      </div>
      <div className="tw-flex tw-items-center tw-mt-1">
        <Link href={song.spotifyUrl} variant={Link.variant.UNSTYLED} className="tw-mr-2">
          <Icon icon={Icon.icon.SPOTIFY} size={24} />
        </Link>
        <Link href={song.youtubeUrl} variant={Link.variant.UNSTYLED}>
          <Icon icon={Icon.icon.YOUTUBE} size={24} />
        </Link>
      </div>
    </div>
  );
}

export default SongDetails;

// --- Controller ---

function useController() {
  function getProgressStyles(song: T_Song, index: number) {
    return index <= song.progress
      ? (song.progress === 1
          ? {
              1: "tw-bg-red-500",
            }
          : song.progress === 2
          ? {
              1: "tw-bg-yellow-400",
              2: "tw-bg-yellow-500",
            }
          : song.progress === 3
          ? {
              1: "tw-bg-yellow-300",
              2: "tw-bg-yellow-400",
              3: "tw-bg-yellow-500",
            }
          : song.progress === 4
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
      : "tw-opacity-75 tw-bg-gray-200";
  }

  return { getProgressStyles };
}
