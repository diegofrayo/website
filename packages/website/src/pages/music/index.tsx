import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, UL, Link } from "~/components";
import { SongInfo } from "~/components/pages/music";
import Routes from "~/data/routes.json";
import { useInternationalization } from "~/hooks";
import { TypePagesRoutes, TypeSong } from "~/types";
import { getSongsList } from "~/utils/music";
import { removeEmojiFromTitle } from "~/utils/strings";

function MusicPage(): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC as TypePagesRoutes,
    layout: true,
  });

  return (
    <Page
      config={{
        title: removeEmojiFromTitle(SiteTexts.page.current_locale.title),
        pathname: Routes.MUSIC,
        description: SiteTexts.page.current_locale.meta_description,
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
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <p className="tw-mb-4">{SiteTexts.page.current_locale.description}</p>
        <UL>
          {getSongsList().map((song: TypeSong) => {
            return (
              <li key={`SongItem-${song.id}`}>
                <Link is={NextLink} href={`${Routes.MUSIC}/${song.id}`}>
                  {song.title}
                </Link>
                <SongInfo song={song} SiteTexts={SiteTexts} className="tw-ml-4 tw-mb-4" />
              </li>
            );
          })}
        </UL>
      </MainLayout>
    </Page>
  );
}

export default MusicPage;
