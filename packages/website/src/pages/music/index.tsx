import React, { Fragment } from "react";

import { Page, MainLayout } from "~/components/layout";
import { List, Link, Icon, Title } from "~/components/primitive";
import { Emoji, Render } from "~/components/pages/_shared";
import { SongDetails } from "~/components/pages/music";
import { useInternationalization, useQuery } from "~/hooks";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
import { ROUTES } from "~/utils/routing";
import { isUserLoggedIn } from "~/utils/misc";

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
        showGoToTopButton
      >
        <p>{SiteTexts.page.current_locale.description} </p>

        <Render isLoading={isLoading} error={error} data={data}>
          {(data: T_Song[]) => {
            const songsList = isUserLoggedIn()
              ? data.slice(1)
              : data.filter((song) => song.progress === 5);

            return (
              <Fragment>
                <Title
                  is="h2"
                  variant={Title.variant.SECONDARY}
                  size={Title.size.MD}
                  className="tw-my-6"
                >
                  <Link
                    href={`${ROUTES.MUSIC}/${data[0].id}`}
                    variant={Link.variant.SECONDARY}
                    isNextLink
                  >
                    <Emoji className="tw-mr-2">📓</Emoji>
                    <span className="tw-underline">{data[0].title}</span>
                  </Link>
                </Title>

                <Title
                  is="h2"
                  variant={Title.variant.SECONDARY}
                  size={Title.size.MD}
                  className="tw-mb-2"
                >
                  <Emoji className="tw-mr-2">🎶</Emoji>
                  <span>Canciones [{songsList.length - 1}]</span>
                </Title>

                <List
                  className="tw-flex tw-flex-wrap tw-justify-between"
                  variant={List.variant.UNSTYLED}
                >
                  {songsList.map((song) => {
                    return (
                      <List.Item key={song.id} className="tw-w-full sm:tw-w-5/12">
                        <Link
                          href={`${ROUTES.MUSIC}/${song.id}`}
                          variant={Link.variant.SECONDARY}
                          className="tw-font-bold tw-flex"
                          isNextLink
                        >
                          <span className="tw-flex-1 sm:tw-truncate" title={song.title}>
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
