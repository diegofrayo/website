import React, { useState } from "react";
import fs from "fs";

import { Page, MainLayout, Modal, Separator } from "~/components";
import { SongInfo } from "~/components/pages/music";
import Routes from "~/data/routes.json";
import { useDidMount, useInternationalization } from "~/hooks";
import Chords from "~/lib/chords";
import { TypeSong, TypePagesRoutes } from "~/types";
import { getChord, getSongsList, parseSong } from "~/utils/music";

type TypeSongPageProps = {
  song: TypeSong;
  songContent: any;
};

function SongPage({ song, songContent }: TypeSongPageProps): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC as TypePagesRoutes,
    layout: true,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChord, setSelectedChord] = useState(undefined);

  useDidMount(() => {
    document.querySelectorAll(".chord")?.forEach(button => {
      button.addEventListener("click", function (event: any) {
        setSelectedChord(getChord(event.target.innerText) as any);
        setIsModalVisible(true);
      });
    });
  });

  function handleModalClose() {
    setIsModalVisible(false);
    setSelectedChord(undefined);
  }

  return (
    <Page
      config={{
        title: song.title,
        pathname: `${Routes.MUSIC}/${song.id}`,
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.music,
            url: Routes.MUSIC as TypePagesRoutes,
          },
          {
            text: song.title,
          },
        ]}
        title={song.title}
      >
        <SongInfo song={song} SiteTexts={SiteTexts} />
        <pre
          className="tw-text-sm tw-max-w-full tw-overflow-x-auto tw-border tw-p-2 twc-border-color-primary dark:twc-border-color-primary"
          dangerouslySetInnerHTML={{
            __html: songContent,
          }}
        />

        <Modal visible={isModalVisible} onCloseHandler={handleModalClose}>
          <section className="tw-bg-white dark:tw-bg-black tw-p-4 tw-rounded-md">
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
              className="tw-text-center tw-text-sm tw-block tw-font-bold tw-w-full tw-transition-opacity hover:tw-opacity-75 tw-border twc-border-color-primary dark:twc-border-color-primary"
              onClick={handleModalClose}
            >
              cerrar
            </button>
          </section>
        </Modal>
      </MainLayout>
    </Page>
  );
}

// TODO: Next types
export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: getSongsList().reduce((result, song: TypeSong) => {
      return result.concat([{ params: { song: song.id } }]);
    }, [] as Array<any>),
    fallback: false,
  };
}

// TODO: Next types
export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const song: TypeSong | undefined = getSongsList().find(song => song.id === params.song);
  const file = fs.readFileSync(
    `${process.cwd()}/src/data/music/songs/${song?.id}.txt`,
    "utf8",
  );

  return { props: { song, songContent: parseSong(file.toString()) } };
}

export default SongPage;
