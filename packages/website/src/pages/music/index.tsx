import React, { Fragment } from "react";

import { Page, MainLayout } from "~/components/layout";
import { List, Link, Icon } from "~/components/primitive";
import { Emoji, Render } from "~/components/pages/_shared";
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
        <p>{SiteTexts.page.current_locale.description}</p>

        <Render isLoading={isLoading} error={error} data={data}>
          {(data: T_Song[]) => {
            return (
              <Fragment>
                <Link
                  href={`${ROUTES.MUSIC}/${data[0].id}`}
                  variant={Link.variant.SECONDARY}
                  className="tw-font-bold tw-mt-6 tw-mb-7 tw-uppercase tw-inline-block tw-px-4 tw-py-2 tw-rounded-md dfr-bg-secondary dark:dfr-bg-secondary"
                  isNextLink
                >
                  <Emoji className="tw-mr-2">📓</Emoji>
                  <span>{data[0].title}</span>
                </Link>

                <List className="tw-flex tw-flex-wrap tw-justify-between">
                  {data.map((song) => {
                    if (!song.isPublished || !song.artist) return null;

                    return (
                      <List.Item key={song.id} className="tw-w-full sm:tw-w-5/12">
                        <Link
                          href={`${ROUTES.MUSIC}/${song.id}`}
                          variant={Link.variant.SECONDARY}
                          className="tw-font-bold tw-flex"
                          isNextLink
                        >
                          <span className="tw-flex-1 tw-truncate" title={song.title}>
                            {song.title}
                          </span>
                          {song.progress === 5 && (
                            <Icon
                              icon={Icon.icon.CHECK}
                              wrapperClassName="tw-ml-2 tw-flex-shrink-0"
                              size={20}
                            />
                          )}
                        </Link>
                        <SongDetails song={song} SiteTexts={SiteTexts} />
                      </List.Item>
                    );
                  })}
                </List>
              </Fragment>
            );
          }}
        </Render>
      </MainLayout>
    </Page>
  );
}

export default MusicPage;
