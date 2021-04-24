import React, { useState } from "react";
import classNames from "classnames";

import { Blockquote, Button, Icon, Modal, Space } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { GuitarChord, GuitarService, T_Chord } from "~/lib/guitar";
import { T_Function, T_ReactElement } from "~/types";
import { createArray, safeCastNumber } from "~/utils/misc";

type T_LyricsAndChords = {
  children: string;
  chords: string[];
};

function LyricsAndChords(props: T_LyricsAndChords): T_ReactElement {
  const {
    // states
    isModalVisible,
    selectedChord,
    selectedChordIndex,
    handleUpdateSelectedChordIndex,

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
        <div className="tw-bg-white dark:tw-bg-black tw-p-4 tw-rounded-md tw-w-96 tw-mx-auto tw-max-w-full">
          {Array.isArray(selectedChord) ? (
            <div>
              {selectedChord.map((chord, index) => {
                return (
                  <div
                    key={`Chord-${chord.name}-${index}`}
                    className={classNames(index === selectedChordIndex ? "tw-block" : "tw-hidden")}
                  >
                    <GuitarChord
                      name={chord.name}
                      musicNotes={chord.musicNotes}
                      stringsToSkip={chord.stringsToSkip}
                      showOptions={false}
                    />
                  </div>
                );
              })}
              <div className="tw-flex tw-justify-between tw-items-center tw-mt-1">
                <Button
                  onClick={() => {
                    handleUpdateSelectedChordIndex(-1);
                  }}
                >
                  <Icon icon={Icon.icon.CHEVRON_LEFT} size={20} />
                </Button>
                <div className="tw-flex-1 tw-text-center">
                  {createArray(selectedChord.length, 0).map((index) => {
                    return (
                      <span
                        key={`Chord-point-${index}`}
                        className={classNames(
                          "tw-inline-block tw-h-2 tw-w-2 tw-rounded-full tw-mx-1",
                          selectedChordIndex === index
                            ? "tw-bg-black dark:tw-bg-white"
                            : "tw-bg-gray-400",
                        )}
                      />
                    );
                  })}
                </div>
                <Button
                  onClick={() => {
                    handleUpdateSelectedChordIndex(1);
                  }}
                >
                  <Icon icon={Icon.icon.CHEVRON_RIGHT} size={20} />
                </Button>
              </div>
            </div>
          ) : selectedChord ? (
            <GuitarChord
              name={selectedChord.name}
              musicNotes={selectedChord.musicNotes}
              stringsToSkip={selectedChord.stringsToSkip}
              showOptions={false}
            />
          ) : null}
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
  isModalVisible: boolean;
  selectedChord: T_Chord | undefined;
  selectedChordIndex: number;

  handleUpdateSelectedChordIndex: (value: number) => void;
  handleModalClose: T_Function;

  numberOfChords: number;
  parsedChords: string;
  parsedLyrics: string;
} {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChord, setSelectedChord] = useState<T_Chord | undefined>(undefined);
  const [selectedChordIndex, setSelectedChordIndex] = useState(0);

  useDidMount(() => {
    document.querySelectorAll(".dfr-Chord")?.forEach((button) => {
      button.addEventListener("click", function (event) {
        const target = event.target as HTMLElement;
        const chord = GuitarService.findChord(target?.innerText);

        if (!chord) {
          alert("This chord does not exist");
          return;
        }

        setSelectedChord(chord);
        setSelectedChordIndex(safeCastNumber(target?.getAttribute("data-chord-index") || ""));
        setIsModalVisible(true);
      });
    });
  });

  function handleModalClose(): void {
    setIsModalVisible(false);
    setSelectedChord(undefined);
  }

  function handleUpdateSelectedChordIndex(value: number): void {
    if (selectedChordIndex + value < 0) {
      setSelectedChordIndex((selectedChord as T_Chord[]).length - 1);
    } else if (selectedChordIndex + value > (selectedChord as T_Chord[]).length - 1) {
      setSelectedChordIndex(0);
    } else {
      setSelectedChordIndex(selectedChordIndex + value);
    }
  }

  return {
    // states
    isModalVisible,
    selectedChord,
    selectedChordIndex,
    handleUpdateSelectedChordIndex,

    // handlers
    handleModalClose,

    // utils
    numberOfChords: chords.length,
    parsedChords: GuitarService.parseSongLyrics(chords.sort().join(" | ")),
    parsedLyrics: GuitarService.parseSongLyrics(children),
  };
}
