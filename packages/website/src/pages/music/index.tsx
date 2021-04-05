import React, { Fragment } from "react";
import NextLink from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { UL, Link } from "~/components/primitive";
import { Render } from "~/components/shared";
import { SongInfo } from "~/components/mdx/blog-posts/music";
import Routes from "~/data/routes.json";
import { useInternationalization, useQuery } from "~/hooks";
import MusicService from "~/services/music";
import { TypePagesRoutes, TypeSong } from "~/types";
import { sortBy } from "~/utils/misc";
import { removeEmojiFromPageTitle } from "~/utils/strings";

function MusicPage(): any {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC as TypePagesRoutes,
    layout: true,
  });

  const { isLoading, error, data } = useQuery("songsList", MusicService.fetchSongsList);

  return (
    <Page
      config={{
        title: removeEmojiFromPageTitle(SiteTexts.page.current_locale.title),
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
        <p className="tw-mb-6">{SiteTexts.page.current_locale.description}</p>

        <Render isLoading={isLoading} error={error} data={data}>
          {data => {
            return (
              <UL>
                {data
                  .sort(
                    sortBy([
                      { param: "progress", order: "desc" },
                      { param: "title", order: "asc" },
                    ]),
                  )
                  .map((song: TypeSong) => {
                    if (!song.published) return null;

                    return (
                      <Fragment key={song.id}>
                        <Link
                          is={NextLink}
                          href={`${Routes.MUSIC}/${song.id}`}
                          styled={false}
                          className="tw-font-bold tw-text-black dark:tw-text-white"
                        >
                          {song.title}
                        </Link>
                        <SongInfo song={song} SiteTexts={SiteTexts} />
                      </Fragment>
                    );
                  })}
              </UL>
            );
          }}
        </Render>
      </MainLayout>
    </Page>
  );
}

export default MusicPage;
