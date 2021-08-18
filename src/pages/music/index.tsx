import React, { Fragment, useState } from "react";

import { Page, MainLayout } from "~/components/layout";
import { List, Link, Icon, Title, Space, Input } from "~/components/primitive";
import { Emoji, Render } from "~/components/pages/_shared";
import { SongDetails } from "~/components/pages/music";
import { useQuery } from "~/hooks";
import { getPageContentStaticProps, useTranslation } from "~/i18n";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
import { isUserLoggedIn } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";

function MusicPage(): T_ReactElement {
  const {
    // states
    inputValue,

    // vars
    isLoading,
    error,
    data,

    // handlers
    onInputChange,

    // utils
    parseData,
  } = useController();
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("page:title"),
        pathname: ROUTES.MUSIC,
        description: t("page:description"),
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: t("layout:breadcumb:home"),
            url: ROUTES.HOME,
          },
          {
            text: t("layout:breadcumb:music"),
          },
        ]}
        title={t("page:title")}
        showGoToTopButton
      >
        <p>{t("page:description")}</p>

        <Render isLoading={isLoading} error={error} data={data}>
          {(data: T_Song[]) => {
            const { chordsPage, songsList } = parseData(data);

            return (
              <Fragment>
                <Title
                  is="h2"
                  variant={Title.variant.SECONDARY}
                  size={Title.size.MD}
                  className="tw-mt-6"
                >
                  <Link
                    href={`${ROUTES.MUSIC}/${chordsPage.id}`}
                    variant={Link.variant.SECONDARY}
                    locale="es"
                    isNextLink
                  >
                    <Emoji className="tw-mr-2">📓</Emoji>
                    <span className="tw-underline">{t("page:chords_title")}</span>
                  </Link>
                </Title>
                <Space sizeTop={6} sizeBottom={5} variant={Space.variant.DASHED} />

                <Title is="h2" variant={Title.variant.SECONDARY} size={Title.size.MD} className="">
                  <Emoji className="tw-mr-2">🎶</Emoji>
                  <span>
                    {t("page:songs_title")} [{songsList.length}]
                  </span>
                </Title>

                <Input
                  type="text"
                  className="tw-my-4"
                  placeholder={t("page:search")}
                  value={inputValue}
                  onChange={onInputChange}
                />

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
                          locale="es"
                          isNextLink
                        >
                          <span className="tw-flex-1 sm:tw-truncate" title={song.title}>
                            {song.title}
                          </span>
                          {song.progress === 5 && (
                            <Icon
                              icon={Icon.icon.CHECK}
                              wrapperClassName="tw-ml-2 tw-flex-shrink-0 tw-self-start tw-relative tw-top-1"
                              size={20}
                            />
                          )}
                        </Link>
                        <SongDetails song={song} />
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

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.MUSIC,
});

// --- Controller ---

function useController() {
  const { isLoading, error, data } = useQuery("songsList", MusicService.fetchSongsList);
  const [inputValue, setInputValue] = useState("");

  function onInputChange(e) {
    setInputValue(e.currentTarget.value.toLowerCase());
  }

  function parseData(songs: T_Song[]) {
    return {
      chordsPage: songs[0],
      songsList: (isUserLoggedIn()
        ? songs.slice(1)
        : songs.filter((song) => song.progress === 5)
      ).filter((song) => {
        return (
          song.title.toLowerCase().includes(inputValue) ||
          song.artist.toLowerCase().includes(inputValue)
        );
      }),
    };
  }

  return {
    // states
    inputValue,

    // vars
    isLoading,
    error,
    data,

    // handlers
    onInputChange,

    // utils
    parseData,
  };
}
