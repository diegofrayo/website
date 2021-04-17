import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { List, Link } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { SongDetails } from "~/components/pages/music";
import { ROUTES } from "~/utils/routing";
import { useInternationalization, useQuery } from "~/hooks";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";

function MusicPage(): T_ReactElement {
  const { SiteTexts } = useInternationalization({
    page: ROUTES.MUSIC,
    layout: true,
  });

  const { isLoading, error, data } = useQuery("songsList", MusicService.fetchSongsList);

  return (
    <Page
      config={{
        title: SiteTexts.page.current_locale.title,
        pathname: ROUTES.MUSIC,
        description: SiteTexts.page.current_locale.meta_description,
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
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
                {(data as T_Song[]).map((song: T_Song) => {
                  if (!song.isPublished) return null;

                  return (
                    <List.Item key={song.id}>
                      <Link
                        href={`${ROUTES.MUSIC}/${song.id}`}
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
