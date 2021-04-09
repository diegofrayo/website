import React, { useState } from "react";

import { Blockquote, Button, Icon, Modal, Space } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { Chords } from "~/lib/chords";
import MusicService from "~/services/music";

type T_LyricsAndChords = {
  children: any;
  chords: string[];
};

function LyricsAndChords(props: T_LyricsAndChords): JSX.Element {
  const {
    isModalVisible,
    selectedChord,
    handleModalClose,
    parsedChords,
    parsedLyrics,
  } = useController(props);

  return (
    <div>
      {parsedChords && (
        <Blockquote className="tw-p-4 tw-mb-8 tw-border" variant={Blockquote.variant.UNSTYLED}>
          <strong className="tw-block tw-mb-2">Acordes</strong>
          <pre
            className="tw-break-all tw-max-w-full tw-whitespace-normal"
            dangerouslySetInnerHTML={{ __html: parsedChords }}
          />
        </Blockquote>
      )}

      <pre
        className="tw-p-1 tw-break-normal tw-leading-none"
        dangerouslySetInnerHTML={{ __html: parsedLyrics }}
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
          <Space className="tw-mt-6 tw-mb-1" />
          <Button className="tw-text-center tw-block tw-w-full" onClick={handleModalClose}>
            <Icon icon={Icon.icon.X} size={24} />
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default LyricsAndChords;

// --- Controller ---

function useController({ children, chords }: T_LyricsAndChords) {
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

  return {
    isModalVisible,
    selectedChord,
    parsedChords: chords ? MusicService.parseLyricsAndChords(chords.join(" | ")) : "",
    parsedLyrics: MusicService.parseLyricsAndChords(children),
    handleModalClose,
  };
}
