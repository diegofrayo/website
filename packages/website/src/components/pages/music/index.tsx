import React, { useState } from "react";
import classNames from "classnames";

import {
  Modal,
  Space,
  Link,
  Icon,
  Title,
  Image,
  List,
  Blockquote,
  Button,
} from "~/components/primitive";
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
    <div className={classNames("tw-text-sm tw-italic", className)}>
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
              className={classNames(
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
          <Icon icon={Icon.icon.SPOTIFY} size={24} />
        </Link>
        <Link href={song.youtubeUrl} variant={Link.variant.UNSTYLED}>
          <Icon icon={Icon.icon.YOUTUBE} size={24} />
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
        <Blockquote className="tw-p-4 tw-mb-8 tw-border" variant={Blockquote.variant.UNSTYLED}>
          <strong className="tw-block tw-mb-2">Acordes</strong>
          <pre
            className="tw-break-all tw-max-w-full tw-whitespace-normal"
            dangerouslySetInnerHTML={{
              __html: MusicService.parseLyricsAndChords(chords.join(" | ")),
            }}
          />
        </Blockquote>
      )}

      <pre
        className="tw-p-1 tw-break-normal tw-leading-none"
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
          <Button className="tw-text-center tw-block tw-w-full" onClick={handleModalClose}>
            <Icon icon={Icon.icon.X} size={24} />
          </Button>
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

      <List>
        {sources.map((source, index) => {
          return <SongSourcesItem key={`SongSourcesItem-${index}`} source={source} />;
        })}
      </List>
    </section>
  );
}

function SongSourcesItem({ source }) {
  const { ImageComponent } = useSongSourcesItemController(source.source);

  return (
    <div className="tw-max-w-lg">
      <Link
        key={generateSlug(source.text)}
        href={source.url}
        variant={Link.variant.UNSTYLED}
        className="tw-flex tw-items-center tw-py-1"
      >
        <ImageComponent />
        <div className="tw-flex-1 tw-min-w-0">
          <p
            className="tw-font-bold tw-text-sm tw-text-black dark:tw-text-white tw-truncate"
            title={source.text}
          >
            {source.text}
          </p>
          <p className="tw-text-xs tw-italic">{source.source}</p>
        </div>
      </Link>
    </div>
  );
}

function useSongSourcesItemController(source) {
  if (source.includes("lacuerda")) {
    return {
      ImageComponent: function ImageComponent() {
        return (
          <Image
            src="/static/images/misc/la-cuerda.png"
            alt="La cuerda icon"
            className="tw-w-8 tw-h-8 tw-mr-2 tw-rounded-full"
          />
        );
      },
    };
  }

  const icon = source.includes("youtube") ? Icon.icon.YOUTUBE : Icon.icon.LINK;

  return {
    ImageComponent: function ImageComponent() {
      return <Icon icon={icon} size="tw-w-8 tw-h-8" wrapperClassName="tw-mr-2" />;
    },
  };
}
