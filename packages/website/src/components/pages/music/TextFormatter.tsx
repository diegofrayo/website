import React, { useState, Fragment } from "react";
import classNames from "classnames";
import reactStringReplace from "react-string-replace";

import { Blockquote, Button, Icon, Modal, Space } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { GuitarChord, GuitarService, T_Chord } from "~/lib/guitar";
import { T_Function, T_ReactElement, T_ReactChildrenProp } from "~/types";
import { createArray, safeCastNumber } from "~/utils/misc";

type T_TextFormatterProps = {
  children: string;
  chords: string[];
  insertions: { text: string; replacement: T_ReactElement }[];
};

function TextFormatter(props: T_TextFormatterProps): T_ReactElement {
  const {
    // states
    isModalVisible,
    selectedChord,
    selectedChordIndex,
    handleUpdateSelectedChordIndex,

    // handlers
    handleModalClose,

    // vars
    numberOfChords,
    parsedChords,
    parsedLyrics,
  } = useController(props);

  return (
    <div>
      {parsedLyrics}
      {parsedChords && parsedLyrics && <Space size={6} />}
      {parsedChords && (
        <Blockquote
          className="tw-p-4 tw-border tw-font-mono tw-text-base"
          variant={Blockquote.variant.UNSTYLED}
        >
          <p className="tw-font-bold tw-mb-2">Acordes [{numberOfChords}]</p>
          <pre
            className="tw-break-all tw-max-w-full tw-whitespace-normal"
            dangerouslySetInnerHTML={{ __html: parsedChords }}
          />
        </Blockquote>
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
                      playedStrings={chord.playedStrings}
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
                <div className="tw-flex-1 tw-justify-center tw-flex tw-items-center">
                  {createArray(selectedChord.length, 0).map((index) => {
                    return (
                      <span
                        key={`Chord-point-${index}`}
                        className={classNames(
                          "tw-inline-flex tw-justify-center tw-items-center tw-rounded-full tw-mx-1 tw-h-4 tw-w-4 tw-text-white dark:tw-text-black tw-text-xxs tw-leading-0",
                          selectedChordIndex === index
                            ? "tw-bg-black dark:tw-bg-white tw-font-bold"
                            : "tw-bg-gray-400",
                        )}
                      >
                        {index + 1}
                      </span>
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
              playedStrings={selectedChord.playedStrings}
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

export default TextFormatter;

// --- Controller ---

function useController({ children, chords, insertions }: T_TextFormatterProps): {
  isModalVisible: boolean;
  selectedChord: T_Chord | undefined;
  selectedChordIndex: number;

  handleUpdateSelectedChordIndex: (value: number) => void;
  handleModalClose: T_Function;

  numberOfChords: number;
  parsedChords: string;
  parsedLyrics: T_ReactChildrenProp;
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

  function parseInsertions(
    parsedContent: string,
    insertions?: T_TextFormatterProps["insertions"],
  ): T_ReactChildrenProp {
    let result;

    if (insertions) {
      insertions.forEach(({ text, replacement }, index) => {
        result = reactStringReplace(index === 0 ? parsedContent : result, text, () => replacement);
      });
    } else {
      result = [parsedContent];
    }

    return result.map((item, index) => {
      if (typeof item === "string") {
        return (
          <pre
            key={`TextFormatter-item-${index}`}
            className="tw-p-1 tw-break-normal tw-leading-none"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        );
      }

      return <Fragment key={`TextFormatter-item-${index}`}>{item}</Fragment>;
    });
  }

  return {
    // states
    isModalVisible,
    selectedChord,
    selectedChordIndex,
    handleUpdateSelectedChordIndex,

    // handlers
    handleModalClose,

    // vars
    numberOfChords: chords.length,
    parsedChords: GuitarService.formatText(chords.sort().join(" | ")),
    parsedLyrics: parseInsertions(GuitarService.formatText(children), insertions),
  };
}