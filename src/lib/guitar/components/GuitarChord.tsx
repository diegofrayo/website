import React, { Fragment, useRef, useState } from "react";
import classNames from "classnames";

import { Space, Button, Title } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useExecuteCallback } from "~/hooks";
import { T_Function, T_ReactElement, T_ReactRefObject } from "~/types";
import { copyToClipboard } from "~/utils/browser";

import GuitarFret from "./GuitarFret";
import GuitarService from "../service";
import { T_ParsedChord, T_GuitarFret, T_GuitarPlayedStrings, T_MusicNote } from "../types";

type T_GuitarChordProps = {
  name: string;
  musicNotes: T_MusicNote[] | string; // "STRING|BARRE,FRET,FINGER?"
  playedStrings?: T_GuitarPlayedStrings;
  showOptions?: boolean;
};

function GuitarChord(props: T_GuitarChordProps): T_ReactElement {
  const {
    // props
    name,
    playedStrings,
    showOptions,

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
      <strong className="tw-block tw-text-red-700 dark:tw-text-red-400 tw-mt-2">
        Syntax error: {error.message}
      </strong>
    );
  }

  if (!data) {
    return null;
  }

  const { firstFret, lastFret, musicNotesAsString, groupedMusicNotesByGuitarFret } = data;

  return (
    <article className="tw-max-w-full tw-text-center tw-font-serif">
      <section ref={chordContainerRef}>
        <Title
          is="h1"
          variant={Title.variant.SECONDARY}
          className="tw-truncate tw-text-center tw-mb-2"
          size={Title.size.MD}
        >
          {name}
        </Title>

        <div className="tw-inline-flex tw-flex-no-wrap tw-overflow-x-auto tw-max-w-full tw-items-end">
          <GuitarFret variant={GuitarFret.variant.STRINGS_NAMES} />

          <div className="tw-relative tw-inline-flex tw-flex-no-wrap">
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

            {firstFret > 1 && (
              <GuitarFret
                variant={GuitarFret.variant.EMPTY}
                number={(firstFret - 1) as T_GuitarFret}
              />
            )}
          </div>

          {playedStrings && (
            <GuitarFret
              variant={GuitarFret.variant.SKIPPED_STRINGS}
              playedStrings={playedStrings}
            />
          )}
        </div>
      </section>

      {showOptions && (
        <div>
          <div className="tw-pt-2">
            <Button className="tw-text-sm tw-font-bold tw-p-1" onClick={handleDownloadAsImage}>
              <Emoji className="tw-mr-1">⬇️</Emoji>
              <span>descargar como imagen</span>
            </Button>
            <Space size={1} orientation="v" />

            {musicNotesAsString && (
              <Fragment>
                <Button
                  className="tw-text-sm tw-font-bold tw-py-1 tw-px-2"
                  onClick={handleShowChordInput}
                >
                  <span
                    className={classNames(
                      "tw-inline-block tw-transition-all tw-transform tw-mr-1",
                      showChordInput && "tw-rotate-90",
                    )}
                  >
                    ‣
                  </span>
                  <span>{showChordInput ? "ocultar" : "mostrar"} notas</span>
                </Button>
                <Space size={1} orientation="v" />
              </Fragment>
            )}
          </div>
          {showChordInput && (
            <div className="tw-text-sm tw-mt-4 tw-text-center">
              <pre className="tw-whitespace-pre-line tw-text-sm tw-break-all tw-border tw-inline-block tw-p-2 dfr-border-color-primary dark:dfr-border-color-primary">
                <Button
                  className="tw-text-sm tw-font-bold tw-transition-opacity hover:tw-opacity-75"
                  data-clipboard-text={musicNotesAsString}
                  onClick={copyToClipboard}
                >
                  <Emoji>📋</Emoji>
                </Button>{" "}
                {musicNotesAsString}
              </pre>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default GuitarChord;

// --- Controller ---

function useController({
  name,
  musicNotes,
  playedStrings,
  showOptions = true,
}: T_GuitarChordProps): Pick<T_GuitarChordProps, "name" | "playedStrings" | "showOptions"> & {
  // states
  showChordInput: boolean;
  chordContainerRef: T_ReactRefObject<HTMLDivElement>;

  // handlers
  handleDownloadAsImage: T_Function;
  handleShowChordInput: T_Function;

  // vars
  data: T_ParsedChord;
  error: Error | undefined;
} {
  const { data, error } = useExecuteCallback(musicNotes, (params) => {
    return GuitarService.buildChord(params);
  });

  const chordContainerRef = useRef<HTMLDivElement>(null);
  const [showChordInput, setChordInput] = useState(false);

  async function handleDownloadAsImage(): Promise<void> {
    const domtoimage = await import("dom-to-image");

    domtoimage.toPng(chordContainerRef.current, { quality: 1 }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = dataUrl;
      link.click();
    });
  }

  function handleShowChordInput(): void {
    setChordInput((cs) => !cs);
  }

  return {
    // props
    name,
    showOptions,
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
