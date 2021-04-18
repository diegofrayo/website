import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { List, Link, Icon } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { SongDetails } from "~/components/pages/music";
import { useInternationalization, useQuery } from "~/hooks";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
import { ROUTES } from "~/utils/routing";

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
                        {song.isCompleted && (
                          <Icon
                            icon={Icon.icon.CHECK}
                            wrapperClassName="tw-ml-2 tw-relative tw-top-1"
                            size={20}
                          />
                        )}
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
