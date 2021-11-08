import React from "react";
import classNames from "classnames";
import reactStringReplace from "react-string-replace";

import { Button, Icon, Modal, Space, Block, InlineText } from "~/components/primitive";
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
    parsedLyrics,
  } = useController(props);

  return (
    <Block>
      {parsedLyrics}

      <Modal visible={isModalVisible} onCloseHandler={handleModalClose}>
        <Block className="tw-bg-white dark:dfr-bg-primary tw-p-4 tw-rounded-md tw-w-96 tw-mx-auto tw-max-w-full">
          {Array.isArray(selectedChord) ? (
            <Block>
              {selectedChord.map((chord, index) => {
                return (
                  <Block
                    key={`${chord.name}-${index}`}
                    className={classNames(index === selectedChordIndex ? "tw-block" : "tw-hidden")}
                  >
                    <GuitarChord
                      name={chord.name}
                      musicNotes={chord.musicNotes}
                      playedStrings={chord.playedStrings}
                    />
                  </Block>
                );
              })}
              <Block className="tw-flex tw-justify-between tw-items-center tw-mt-1">
                <Button
                  variant={Button.variant.SIMPLE}
                  onClick={() => {
                    handleUpdateSelectedChordIndex(-1);
                  }}
                >
                  <Icon icon={Icon.icon.CHEVRON_LEFT} size={20} />
                </Button>
                <Block className="tw-flex-1 tw-justify-center tw-flex tw-items-center">
                  {createArray(selectedChord.length, 0).map((index) => {
                    return (
                      <InlineText
                        key={`Chord-point-${index}`}
                        className={classNames(
                          "tw-inline-flex tw-justify-center tw-items-center tw-rounded-full tw-mx-1 tw-h-4 tw-w-4 tw-text-white dark:tw-text-black tw-text-xxs tw-leading-0",
                          selectedChordIndex === index
                            ? "tw-bg-black dark:tw-bg-white tw-font-bold"
                            : "tw-bg-gray-400",
                        )}
                      >
                        {index + 1}
                      </InlineText>
                    );
                  })}
                </Block>
                <Button
                  variant={Button.variant.SIMPLE}
                  onClick={() => {
                    handleUpdateSelectedChordIndex(1);
                  }}
                >
                  <Icon icon={Icon.icon.CHEVRON_RIGHT} size={20} />
                </Button>
              </Block>
            </Block>
          ) : selectedChord ? (
            <GuitarChord
              name={selectedChord.name}
              musicNotes={selectedChord.musicNotes}
              playedStrings={selectedChord.playedStrings}
            />
          ) : null}
          <Space size={2} />

          <Button
            variant={Button.variant.SIMPLE}
            className="tw-text-center tw-block tw-w-full tw-leading-0"
            onClick={handleModalClose}
          >
            <Icon icon={Icon.icon.X} size={24} />
          </Button>
        </Block>
      </Modal>
    </Block>
  );
}

export default TextFormatter;

// --- Controller ---

function useController({ children, insertions }: T_TextFormatterProps): {
  isModalVisible: boolean;
  selectedChord: T_Chord | undefined;
  selectedChordIndex: number;

  handleUpdateSelectedChordIndex: (value: number) => void;
  handleModalClose: T_Function;

  parsedLyrics: T_ReactChildrenProp;
} {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedChord, setSelectedChord] = React.useState<T_Chord | undefined>(undefined);
  const [selectedChordIndex, setSelectedChordIndex] = React.useState(0);

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

      return <React.Fragment key={`TextFormatter-item-${index}`}>{item}</React.Fragment>;
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
    parsedLyrics: parseInsertions(GuitarService.formatText(children), insertions),
  };
}
