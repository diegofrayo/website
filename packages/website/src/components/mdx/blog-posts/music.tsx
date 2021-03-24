import React, { useState } from "react";
import classnames from "classnames";

import { Modal, Separator, Link } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { Chords } from "~/lib/chords";
import MusicService from "~/services/music";
import { TypeSiteTexts, TypeSong } from "~/types";

export { Solo } from "~/lib/chords";

export function SongInfo({
  song,
  SiteTexts,
  className,
}: {
  song: TypeSong;
  SiteTexts: TypeSiteTexts;
  className?: string;
}): any {
  return (
    <div className={classnames("tw-text-sm tw-italic", className)}>
      <div>
        <strong>{SiteTexts.page.current_locale.artist}:</strong> <span>{song.artist}</span>
      </div>
      <div>
        <strong>{SiteTexts.page.current_locale.album}:</strong> <span>{song.album}</span>
      </div>
      <div className="tw-flex tw-items-center tw-mt-1">
        <Link href={song.spotifyUrl} styled={false} className="tw-mr-2">
          <img
            src="/static/images/icons/spotify.svg"
            alt="Spotify icon"
            className="tw-w-5 tw-h-5"
          />
        </Link>
        <Link href={song.youtubeUrl} styled={false}>
          <img
            src="/static/images/icons/youtube.svg"
            alt="Spotify icon"
            className="tw-w-6 tw-h-6"
          />
        </Link>
      </div>
    </div>
  );
}

export function LyricsAndChords({ children }: { children: any }): any {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChord, setSelectedChord] = useState(undefined);

  useDidMount(() => {
    document.querySelectorAll(".chord")?.forEach(button => {
      button.addEventListener("click", function (event: any) {
        setSelectedChord(MusicService.findChord(event.target.innerText) as any);
        setIsModalVisible(true);
      });
    });
  });

  function handleModalClose() {
    setIsModalVisible(false);
    setSelectedChord(undefined);
  }

  return (
    <div>
      <pre
        className="tw-text-sm tw-p-1 tw-break-normal"
        dangerouslySetInnerHTML={{
          __html: MusicService.parseLyricsAndChords(children),
        }}
      />

      <Modal visible={isModalVisible} onCloseHandler={handleModalClose}>
        <div className="tw-bg-white dark:tw-bg-black tw-p-4 tw-rounded-md">
          {selectedChord && (
            <Chords
              name={(selectedChord as any)?.name || ""}
              chords={(selectedChord as any)?.chords || ""}
              stringsToSkip={(selectedChord as any)?.stringsToSkip || ""}
              showOptions={false}
            />
          )}
          <Separator className="tw-mt-6 tw-mb-1" />
          <button
            className="tw-text-center tw-text-sm tw-block tw-font-bold tw-w-full tw-transition-opacity hover:tw-opacity-75 tw-border dfr-border-color-primary dark:dfr-border-color-primary"
            onClick={handleModalClose}
          >
            cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
}
