import React from "react";
import fs from "fs";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";

import { Page, MainLayout, MDXContent } from "~/components";
import { SongInfo } from "~/components/pages/music";
import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";
import { TypeSong, TypePagesRoutes } from "~/types";
import { MDXComponentsConfig, MDXScope } from "~/utils/mdx";
import SongsService from "~/utils/music";

type TypeSongPageProps = {
  song: TypeSong;
  content: any;
};

function SongPage({ song, content }: TypeSongPageProps): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC as TypePagesRoutes,
    layout: true,
  });

  const mdxContent = hydrate(content, { components: MDXComponentsConfig });

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
        <div className="tw-p-2 tw-max-w-full tw-overflow-x-auto tw-border dfr-border-color-primary dark:dfr-border-color-primary">
          <MDXContent content={mdxContent} variant={MDXContent.variant.UNSTYLED} />
        </div>
      </MainLayout>
    </Page>
  );
}

// TODO: Next types
export async function getStaticPaths(): Promise<Record<string, any>> {
  return {
    paths: (await SongsService.fetchSongsList()).reduce((result, song: TypeSong) => {
      return result.concat([{ params: { song: song.id } }]);
    }, [] as Array<any>),
    fallback: false,
  };
}

// TODO: Next types
export async function getStaticProps({
  params,
}: Record<string, any>): Promise<Record<string, any>> {
  const song: TypeSong | undefined = (await SongsService.fetchSongsList()).find(
    song => song.id === params.song,
  );

  const file = fs.readFileSync(
    `${process.cwd()}/src/data/music/songs/${song?.id}.mdx`,
    "utf8",
  );
  const content = await renderToString(file, {
    components: MDXComponentsConfig,
    scope: { DATA: { ...MDXScope.DATA } },
  });

  return { props: { song, content } };
}

export default SongPage;
