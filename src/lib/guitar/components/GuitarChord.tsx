import * as React from "react";
import classNames from "classnames";

import { Button, Title, Block, InlineText } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { useExecuteCallback } from "~/hooks";
import AnalyticsService from "~/services/analytics";
import { T_ReactElement, T_ReactRefObject } from "~/types";
import { copyToClipboard, downloadComponentAsImage } from "~/utils/browser";

import GuitarFret from "./GuitarFret";
import GuitarService from "../service";
import { T_ParsedChord, T_GuitarFret, T_GuitarPlayedStrings, T_MusicNote } from "../types";

type T_GuitarChordProps = {
  name: string;
  musicNotes: T_MusicNote[] | string; // "STRING|BARRE,FRET,FINGER?"
  playedStrings?: T_GuitarPlayedStrings;
  enableShowNotesOption?: boolean;
};

function GuitarChord(props: T_GuitarChordProps): T_ReactElement {
  const {
    // props
    name,
    playedStrings,
    enableShowNotesOption,

    // states
    showChordInput,
    chordContainerRef,

    // handlers
    handleDownloadAsImage,
    handleShowChordInput,

    // vars
    error,
    data,
  } = useController(props);

  if (error) {
    return (
      <InlineText is="strong" className="tw-block tw-text-red-700 dark:tw-text-red-400 tw-mt-2">
        Syntax error: {error.message}
      </InlineText>
    );
  }

  if (!data) {
    return null;
  }

  const { firstFret, lastFret, musicNotesAsString, groupedMusicNotesByGuitarFret } = data;

  return (
    <Block is="article" className="tw-max-w-full tw-text-center">
      <Block is="section" className="tw-pb-2 dark:dfr-bg-color-layout" ref={chordContainerRef}>
        <Title
          is="h1"
          variant={Title.variant.SECONDARY}
          className="tw-truncate tw-text-center tw-mb-4"
          size={Title.size.MD}
        >
          {name}
        </Title>

        <Block className="tw-inline-flex tw-flex-no-wrap tw-overflow-x-auto tw-max-w-full tw-items-end">
          <GuitarFret variant={GuitarFret.variant.STRINGS_NAMES} />

          <Block className="tw-relative tw-inline-flex tw-flex-no-wrap">
            <GuitarFret
              variant={GuitarFret.variant.EMPTY}
              number={(lastFret + 1) as T_GuitarFret}
            />

            {Object.entries(groupedMusicNotesByGuitarFret)
              .reverse()
              .map(([fret, musicNotes]: [string, T_MusicNote[]]) => {
                return (
                  <GuitarFret
                    key={`${fret}`}
                    variant={GuitarFret.variant.DEFAULT}
                    number={Number(fret) as T_GuitarFret}
                    musicNotes={musicNotes}
                  />
                );
              })}

            {firstFret > 1 && <GuitarFret variant={GuitarFret.variant.EMPTY} number={1} />}

            <Block className="tw-h-36 tw-relative tw-top-6 tw--left-0.5 tw-w-3 tw-bg-black dark:tw-bg-white tw-rounded-tr-md tw-rounded-br-md" />
          </Block>

          {playedStrings && (
            <GuitarFret
              variant={GuitarFret.variant.SKIPPED_STRINGS}
              playedStrings={playedStrings}
            />
          )}
        </Block>
      </Block>

      <Block className="tw-text-sm">
        <Block>
          <Button variant={Button.variant.DEFAULT} onClick={handleDownloadAsImage}>
            <Emoji>⬇️</Emoji> <InlineText>descargar como imagen</InlineText>
          </Button>

          {musicNotesAsString && enableShowNotesOption ? (
            <Button
              variant={Button.variant.DEFAULT}
              className="tw-mt-1 tw-ml-0 sm:tw-ml-3 sm:tw-mt-0"
              onClick={handleShowChordInput}
            >
              <InlineText
                className={classNames(
                  "tw-inline-block tw-transition-all tw-w-4",
                  showChordInput && "tw-rotate-90",
                )}
              >
                ‣
              </InlineText>
              <InlineText>{showChordInput ? "ocultar" : "mostrar"} notas</InlineText>
            </Button>
          ) : null}
        </Block>

        {showChordInput && (
          <Block className="tw-text-sm tw-mt-3 tw-text-center">
            <pre className="dfr-border-color-primary tw-whitespace-pre-line tw-break-all tw-border tw-inline-block tw-p-2 dark:dfr-border-color-primary">
              <Button
                variant={Button.variant.SIMPLE}
                data-clipboard-text={musicNotesAsString}
                onClick={copyToClipboard}
              >
                <Emoji>📋</Emoji>
              </Button>{" "}
              {musicNotesAsString}
            </pre>
          </Block>
        )}
      </Block>
    </Block>
  );
}

export default GuitarChord;

// --- Controller ---

function useController({
  name,
  musicNotes,
  playedStrings,
  enableShowNotesOption = false,
}: T_GuitarChordProps): Pick<
  T_GuitarChordProps,
  "name" | "playedStrings" | "enableShowNotesOption"
> & {
  // states
  showChordInput: boolean;
  chordContainerRef: T_ReactRefObject<HTMLDivElement>;

  // handlers
  handleDownloadAsImage: () => void;
  handleShowChordInput: () => void;

  // vars
  data: T_ParsedChord;
  error: Error | undefined;
} {
  const { data, error } = useExecuteCallback(musicNotes, (params) => {
    return GuitarService.buildChord(params);
  });

  const chordContainerRef = React.useRef<HTMLDivElement>(null);
  const [showChordInput, setChordInput] = React.useState(false);

  async function handleDownloadAsImage(): Promise<void> {
    await downloadComponentAsImage(chordContainerRef.current, name);

    AnalyticsService.trackEvent("DOWNLOAD_CHORD_AS_IMAGE", {
      chord: name,
      page: window.location.pathname,
    });
  }

  function handleShowChordInput(): void {
    setChordInput((cs) => !cs);
  }

  return {
    // props
    name,
    enableShowNotesOption,
    playedStrings: [
      ...(typeof playedStrings === "string" ? playedStrings.split(",") : playedStrings || []),
    ].reverse(),

    // states
    showChordInput,
    chordContainerRef,

    // handlers
    handleDownloadAsImage,
    handleShowChordInput,

    // vars
    data,
    error,
  };
}
