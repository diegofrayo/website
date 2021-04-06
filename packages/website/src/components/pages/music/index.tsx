import React, { useState } from "react";
import classnames from "classnames";

import { Modal, Space, Link, Icon, Title } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { Chords } from "~/lib/chords";
import MusicService from "~/services/music";
import { TypeSiteTexts, TypeSong } from "~/types";
import { createArray } from "~/utils/misc";
import { generateSlug } from "~/utils/strings";

export { Solo } from "~/lib/chords";

export function SongDetails({
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
      <div>
        <strong>{SiteTexts.page.current_locale.year}:</strong> <span>{song.year}</span>
      </div>
      <div className="tw-flex tw-items-center">
        <strong className="tw-mr-2">{SiteTexts.page.current_locale.progress}:</strong>
        {createArray(5).map(item => {
          return (
            <span
              key={`Progress-item-${item}`}
              className={classnames(
                "tw-inline-block tw-rounded-sm tw-h-3 tw-w-3 tw-mr-0.5",
                item <= song.progress
                  ? (song.progress === 1
                      ? {
                          1: "tw-bg-red-500",
                        }
                      : song.progress === 2
                      ? {
                          1: "tw-bg-yellow-400",
                          2: "tw-bg-yellow-500",
                        }
                      : song.progress === 3
                      ? {
                          1: "tw-bg-yellow-300",
                          2: "tw-bg-yellow-400",
                          3: "tw-bg-yellow-500",
                        }
                      : song.progress === 4
                      ? {
                          1: "tw-bg-green-300",
                          2: "tw-bg-green-400",
                          3: "tw-bg-green-500",
                          4: "tw-bg-green-600",
                        }
                      : {
                          1: "tw-bg-green-300",
                          2: "tw-bg-green-400",
                          3: "tw-bg-green-500",
                          4: "tw-bg-green-600",
                          5: "tw-bg-green-700",
                        })[item]
                  : "tw-opacity-75 tw-bg-gray-200",
              )}
            />
          );
        })}
      </div>
      <div className="tw-flex tw-items-center tw-mt-1">
        <Link href={song.spotifyUrl} variant={Link.variant.UNSTYLED} className="tw-mr-2">
          <Icon
            icon={Icon.icon.SPOTIFY}
            variant={Icon.variant.UNSTYLED}
            className="tw-w-5 tw-h-5"
          />
        </Link>
        <Link href={song.youtubeUrl} variant={Link.variant.UNSTYLED}>
          <Icon
            icon={Icon.icon.YOUTUBE}
            variant={Icon.variant.UNSTYLED}
            className="tw-w-6 tw-h-6"
          />
        </Link>
      </div>
    </div>
  );
}

export function LyricsAndChords({ children, chords }: { children: any; chords?: string[] }): any {
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
      {chords && (
        <pre
          className="tw-p-1 tw-break-normal tw-mb-8"
          dangerouslySetInnerHTML={{
            __html: MusicService.parseLyricsAndChords(["Acordes:", ...chords].join("     ")),
          }}
        />
      )}

      <pre
        className="tw-p-1 tw-break-normal"
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
          <Space className="tw-mt-6 tw-mb-1" />
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
      <Title is="h2" className="tw-mb-2">
        Fuentes
      </Title>

      {sources.map((source, index) => {
        return <SongSourcesItem key={`SongSourcesItem-${index}`} source={source} />;
      })}
    </section>
  );
}

function SongSourcesItem({ source }) {
  const { getIconProps } = useSongSourcesItemController();

  const imageProps = getIconProps(source.source);

  return (
    <Link key={generateSlug(source.text)} href={source.url} variant={Link.variant.UNSTYLED}>
      <div className="dfr-bg-secondary dark:dfr-bg-secondary tw-flex tw-items-center tw-p-3 tw-rounded-md tw-mb-2 tw-transition-opacity hover:tw-opacity-75 tw-max-w-lg tw-h-12">
        <Icon {...imageProps} className={"tw-w-8 tw-h-8 tw-mr-3 tw-rounded-md"} />
        <div className="tw-flex-1 tw-min-w-0">
          <p
            className="tw-font-bold tw-text-sm tw-text-black dark:tw-text-white tw-truncate"
            title={source.text}
          >
            {source.text}
          </p>
          <p className="tw-text-xs tw-italic">{source.source}</p>
        </div>
      </div>
    </Link>
  );
}

function useSongSourcesItemController() {
  function getIconProps(source) {
    let props = {
      icon: Icon.icon.LINK,
      alt: "",
      size: 0,
      variant: Icon.variant.DEFAULT,
    };

    if (source.includes("lacuerda")) {
      props = {
        icon: "/static/images/icons/la-cuerda.png",
        alt: "La cuerda icon",
        size: 0,
        variant: Icon.variant.DEFAULT,
      };
    } else if (source.includes("youtube")) {
      props = {
        icon: Icon.icon.YOUTUBE_DARK,
        alt: "",
        size: 22,
        variant: Icon.variant.UNSTYLED,
      };
    }

    return props;
  }

  return { getIconProps };
}
