import React, { Fragment, useState } from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { List, Link, Title, Space, Input } from "~/components/primitive";
import { Emoji, Render } from "~/components/pages/_shared";
import { SongDetails } from "~/components/pages/music";
import { AuthService } from "~/auth";
import { useQuery } from "~/hooks";
import { getPageContentStaticProps, I18nService, useTranslation } from "~/i18n";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
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
                    locale={I18nService.getDefaultLocale()}
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
                  id="input"
                  type="text"
                  className="tw-my-4"
                  placeholder={t("page:input_placeholder")}
                  value={inputValue}
                  autoComplete="off"
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
                          locale={I18nService.getDefaultLocale()}
                          isNextLink
                        >
                          <span
                            className={classNames(
                              "tw-flex-1 sm:tw-truncate",
                              !song.isPublic && "tw-line-through",
                            )}
                            title={song.title}
                          >
                            {song.title}
                          </span>
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
      songsList: (AuthService.isUserLoggedIn()
        ? songs.slice(1)
        : songs.slice(1).filter((song) => song.isPublic)
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
