import React, { useState } from "react";

import { Blockquote, Button, Icon, Modal, Space } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { GuitarChord, GuitarService, T_Chord } from "~/lib/guitar";
import { T_Function, T_ReactElement } from "~/types";

type T_LyricsAndChords = {
  children: string;
  chords: string[];
};

function LyricsAndChords(props: T_LyricsAndChords): T_ReactElement {
  const {
    // states
    isModalVisible,
    selectedChord,

    // handlers
    handleModalClose,

    // utils
    numberOfChords,
    parsedChords,
    parsedLyrics,
  } = useController(props);

  return (
    <div>
      {parsedChords && (
        <Blockquote className="tw-p-4 tw-border" variant={Blockquote.variant.UNSTYLED}>
          <strong className="tw-block tw-mb-2">Acordes [{numberOfChords}]</strong>
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
        <div className="tw-bg-white dark:tw-bg-black tw-p-4 tw-rounded-md tw-max-w-lg tw-mx-auto">
          {selectedChord && (
            <GuitarChord
              name={selectedChord.name}
              musicNotes={selectedChord.musicNotes}
              stringsToSkip={selectedChord.stringsToSkip}
              showOptions={false}
            />
          )}
          <Space sizeTop={6} sizeBottom={1} />

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
  numberOfChords: number;
  isModalVisible: boolean;
  selectedChord: T_Chord | undefined;
  parsedChords: string;
  parsedLyrics: string;
  handleModalClose: T_Function;
} {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChord, setSelectedChord] = useState<T_Chord | undefined>(undefined);

  useDidMount(() => {
    document.querySelectorAll(".dfr-Chord")?.forEach((button) => {
      button.addEventListener("click", function (event) {
        setSelectedChord(GuitarService.findChord((event.target as HTMLElement)?.innerText));
        setIsModalVisible(true);
      });
    });
  });

  function handleModalClose(): void {
    setIsModalVisible(false);
    setSelectedChord(undefined);
  }

  return {
    // states
    isModalVisible,
    selectedChord,

    // handlers
    handleModalClose,

    // utils
    numberOfChords: chords.length,
    parsedChords: GuitarService.parseLyricsAndChords(chords.sort().join(" | ")),
    parsedLyrics: GuitarService.parseLyricsAndChords(children),
  };
}
