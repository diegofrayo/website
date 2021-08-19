import React, { useState } from "react";
import classNames from "classnames";

import { Icon, Link } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import { useDidMount } from "~/hooks";
import AuthService from "~/services/auth";
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
  const { getProgressStyles, showProgress } = useController();
  const { t } = useTranslation();

  if (MusicService.isChordsPage(song)) return null;

  return (
    <div className={classNames("tw-text-sm tw-italic", className)}>
      <div className="sm:tw-flex sm:tw-flex-nowrap">
        <strong>{t("page:artist")}:</strong>{" "}
        <span className="sm:tw-ml-1 sm:tw-truncate sm:tw-flex-1" title={song.artist}>
          {song.artist}
        </span>
      </div>
      <div className="sm:tw-flex sm:tw-flex-nowrap">
        <strong>{t("page:album")}:</strong>{" "}
        <span className="sm:tw-ml-1 sm:tw-truncate sm:tw-flex-1" title={song.album}>
          {song.album}
        </span>
      </div>
      <div>
        <strong>{t("page:year")}:</strong> <span>{song.year}</span>
      </div>
      <div className={classNames("tw-items-center", showProgress ? "tw-flex" : "tw-hidden")}>
        <strong className="tw-mr-2">{t("page:progress")}:</strong>
        {createArray(5).map((index) => {
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
      <p className="tw-text-lg tw--mt-1">{song.country}</p>
      <div className="tw-flex tw-items-center tw-mt-1">
        <Link href={song.spotifyUrl} variant={Link.variant.SIMPLE} className="tw-mr-2">
          <Icon icon={Icon.icon.SPOTIFY} size={24} />
        </Link>
        <Link href={song.youtubeUrl} variant={Link.variant.SIMPLE}>
          <Icon icon={Icon.icon.YOUTUBE} size={24} />
        </Link>
      </div>
    </div>
  );
}

export default SongDetails;

// --- Controller ---

function useController(): { showProgress: boolean; getProgressStyles: any } {
  const [showProgress, setShowProgress] = useState(false);

  useDidMount(() => {
    if (AuthService.isUserLoggedIn()) {
      setShowProgress(true);
    }
  });

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
      : "tw-opacity-75 dfr-bg-secondary";
  }

  return { showProgress, getProgressStyles };
}
