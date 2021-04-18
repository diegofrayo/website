import React, { useState } from "react";

import { Blockquote, Button, Icon, Modal, Space } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { Chords } from "~/lib/chords";
import MusicService from "~/services/music";
import { T_Chord, T_Function, T_ReactElement } from "~/types";

type T_LyricsAndChords = {
  children: string;
  chords: string[];
};

function LyricsAndChords(props: T_LyricsAndChords): T_ReactElement {
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
        <Blockquote className="tw-p-4 tw-border" variant={Blockquote.variant.UNSTYLED}>
          <strong className="tw-block tw-mb-2">Acordes</strong>
          <pre
            className="tw-break-all tw-max-w-full tw-whitespace-normal"
            dangerouslySetInnerHTML={{ __html: parsedChords }}
          />
        </Blockquote>
      )}

      {parsedChords && parsedLyrics && <Space size={5} />}

      {parsedLyrics && (
        <pre
          className="tw-p-1 tw-break-normal tw-leading-none"
          dangerouslySetInnerHTML={{ __html: parsedLyrics }}
        />
      )}

      <Modal visible={isModalVisible} onCloseHandler={handleModalClose}>
        <div className="tw-bg-white dark:tw-bg-black tw-p-4 tw-rounded-md">
          {selectedChord && (
            <Chords
              name={selectedChord.name}
              chords={selectedChord.chords}
              stringsToSkip={selectedChord.stringsToSkip}
              showOptions={false}
            />
          )}
          <Space className="tw-mt-6 tw-mb-1" />
          <Button className="tw-text-center tw-block tw-w-full" onClick={handleModalClose}>
            <Icon icon={Icon.icon.X} size={20} />
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default LyricsAndChords;

// --- Controller ---

function useController({
  children,
  chords,
}: T_LyricsAndChords): {
  isModalVisible: boolean;
  selectedChord: T_Chord | undefined;
  parsedChords: string;
  parsedLyrics: string;
  handleModalClose: T_Function;
} {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChord, setSelectedChord] = useState<T_Chord | undefined>(undefined);

  useDidMount(() => {
    document.querySelectorAll(".chord")?.forEach((button) => {
      button.addEventListener("click", function (event) {
        setSelectedChord(MusicService.findChord((event.target as HTMLElement)?.innerText));
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
    parsedChords: chords ? MusicService.parseLyricsAndChords(chords.sort().join(" | ")) : "",
    parsedLyrics: MusicService.parseLyricsAndChords(children),
    handleModalClose,
  };
}
