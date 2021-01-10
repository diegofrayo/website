import * as React from "react";
import fs from "fs";

import { Page, MainLayout } from "~/components";
import Routes from "~/data/routes.json";
import { useDidMount, useInternationalization } from "~/hooks";
import { TypeSong, TypePagesRoutes } from "~/types";
import { getSongsList, parseSong } from "~/utils/music";

type TypeSongPageProps = {
  song: TypeSong;
  songContent: any;
};

function SongPage({ song, songContent }: TypeSongPageProps): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC as TypePagesRoutes,
    layout: true,
  });

  useDidMount(() => {
    document.querySelectorAll(".chord")?.forEach(button => {
      button.addEventListener("click", function (event: any) {
        alert(event?.target?.innerText);
      });
    });
  });

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
        <section className="tw-text-sm tw-mb-8 tw-italic">
          <section>
            <strong>{SiteTexts.page.current_locale.artist}:</strong>{" "}
            <span>{song.artist}</span>
          </section>
          <section>
            <strong>{SiteTexts.page.current_locale.album}:</strong>{" "}
            <span>{song.album}</span>
          </section>
        </section>

        <pre
          className="tw-text-sm tw-max-w-full tw-overflow-x-auto"
          dangerouslySetInnerHTML={{
            __html: songContent,
          }}
        />
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
