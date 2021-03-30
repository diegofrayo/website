import React, { useState } from "react";
import classnames from "classnames";

import { Modal, Separator, Link } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { Chords } from "~/lib/chords";
import MusicService from "~/services/music";
import { TypeSiteTexts, TypeSong } from "~/types";
import { generateSlug } from "~/utils/strings";

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

export function SongSources({ sources }: { sources: TypeSong["sources"] }): any {
  if (sources.length === 0) return null;

  return (
    <section>
      <h2 className="tw-font-bold tw-text-2xl tw-mb-2">Fuentes</h2>

      {sources.map((source, index) => {
        return <SongSourcesItem key={`SongSourcesItem-${index}`} source={source} />;
      })}
    </section>
  );
}

function SongSourcesItem({ source }) {
  const { isLaCuerdaSource, isYouTubeSource } = useSongSources();

  return (
    <Link key={generateSlug(source.text)} href={source.url} styled={false}>
      <div className="dfr-bg-secondary dark:dfr-bg-secondary tw-flex tw-items-center tw-p-2 tw-rounded-md tw-mb-1 tw-transition-opacity hover:tw-opacity-75">
        <img
          className="tw-w-8 tw-h-8 tw-mr-4 tw-rounded-md"
          {...(isLaCuerdaSource(source.source)
            ? { src: "/static/images/icons/la-cuerda.png", alt: "La cuerda icon" }
            : isYouTubeSource(source.source)
            ? { src: "/static/images/icons/youtube-black.svg", alt: "YouTube icon" }
            : { src: "/static/images/icons/link.svg", alt: "Link icon" })}
        />
        <div>
          <p className="tw-font-bold tw-text-sm tw-text-black dark:tw-text-white">{source.text}</p>
          <p className="tw-text-xs tw-italic">{source.source}</p>
        </div>
      </div>
    </Link>
  );
}

function useSongSources() {
  function isLaCuerdaSource(source: string): boolean {
    return source.includes("lacuerda");
  }

  function isYouTubeSource(source: string): boolean {
    return source.includes("youtube");
  }

  return {
    isLaCuerdaSource,
    isYouTubeSource,
  };
}
