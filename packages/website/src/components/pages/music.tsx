import React, { useState } from "react";
import classnames from "classnames";

import { Modal, Separator } from "~/components";
import { useDidMount } from "~/hooks";
import { Chords } from "~/lib/chords";
import { TypeSiteTexts, TypeSong } from "~/types";
import { getChord, parseSong } from "~/utils/music";

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
    <section className={classnames("tw-text-sm tw-italic tw-mb-4", className)}>
      <section>
        <strong>{SiteTexts.page.current_locale.artist}:</strong>{" "}
        <span>{song.artist}</span>
      </section>
      <section>
        <strong>{SiteTexts.page.current_locale.album}:</strong> <span>{song.album}</span>
      </section>
    </section>
  );
}

export function LyricsAndChords({ children }): any {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChord, setSelectedChord] = useState(undefined);

  useDidMount(() => {
    document.querySelectorAll(".chord")?.forEach(button => {
      button.addEventListener("click", function (event: any) {
        setSelectedChord(getChord(event.target.innerText) as any);
        setIsModalVisible(true);
      });
    });
  });

  function handleModalClose() {
    setIsModalVisible(false);
    setSelectedChord(undefined);
  }

  return (
    <section>
      <pre
        className="tw-text-sm tw-p-1"
        dangerouslySetInnerHTML={{
          __html: parseSong(children),
        }}
      />

      <Modal visible={isModalVisible} onCloseHandler={handleModalClose}>
        <section className="tw-bg-white dark:tw-bg-black tw-p-4 tw-rounded-md">
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
            className="tw-text-center tw-text-sm tw-block tw-font-bold tw-w-full tw-transition-opacity hover:tw-opacity-75 tw-border twc-border-color-primary dark:twc-border-color-primary"
            onClick={handleModalClose}
          >
            cerrar
          </button>
        </section>
      </Modal>
    </section>
  );
}
