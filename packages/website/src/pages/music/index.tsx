import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { List, Link } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { SongDetails } from "~/components/pages/music";
import { Routes } from "~/utils/routing";
import { useInternationalization, useQuery } from "~/hooks";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
import { sortBy } from "~/utils/misc";
import { removeEmojiFromPageTitle } from "~/utils/strings";

function MusicPage(): T_ReactElement {
  const { SiteTexts } = useInternationalization({
    page: Routes.MUSIC,
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
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.music,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <p className="tw-mb-6">{SiteTexts.page.current_locale.description}</p>

        <Render isLoading={isLoading} error={error} data={data}>
          {(data) => {
            return (
              <List>
                {data
                  .sort(
                    sortBy([
                      { param: "progress", order: "desc" },
                      { param: "title", order: "asc" },
                    ]),
                  )
                  .map((song: T_Song) => {
                    if (!song.published) return null;

                    return (
                      <List.Item key={song.id}>
                        <Link
                          href={`${Routes.MUSIC}/${song.id}`}
                          variant={Link.variant.SECONDARY}
                          className="tw-font-bold"
                          isNextLink
                        >
                          {song.title}
                        </Link>
                        <SongDetails song={song} SiteTexts={SiteTexts} />
                      </List.Item>
                    );
                  })}
              </List>
            );
          }}
        </Render>
      </MainLayout>
    </Page>
  );
}

export default MusicPage;
