import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Link, Space, Input, Text, InlineText, Block } from "~/components/primitive";
import { Render, Emoji } from "~/components/shared";
import { SongDetails } from "~/components/pages/music/components";
import { AuthService } from "~/auth";
import { useDidMount, useQuery } from "~/hooks";
import { I18nService, useTranslation } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import MusicService from "~/services/music";
import type { T_ReactElement, T_Song } from "~/types";
import { ROUTES } from "~/utils/routing";

function MusicPage(): T_ReactElement {
  const {
    // states
    inputValue,
    inputRef,

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
      <MainLayout title={t("page:title")}>
        <Render isLoading={isLoading} error={error} data={data}>
          {(data: T_Song[]) => {
            const { chordsPage, songsList } = parseData(data);

            return (
              <Block>
                <Block variant="FEATURED">
                  <Link
                    variant={Link.variant.SECONDARY}
                    href={`${ROUTES.MUSIC}/${chordsPage.id}`}
                    locale={I18nService.getDefaultLocale()}
                  >
                    <Emoji className="tw-mr-2">⭐</Emoji>
                    <InlineText className="tw-underline">{t("page:chords_title")}</InlineText>
                  </Link>
                  <Space size={1} />
                  <Text>{t("page:description_1")}</Text>
                </Block>
                <Space size={6} variant={Space.variant.DASHED} />

                <Block variant="FEATURED">
                  <Text>{t("page:description_2")}</Text>
                  <Space size={6} variant={Space.variant.DASHED} />

                  <Block>
                    <Input
                      id="input"
                      type="text"
                      placeholder={t("page:input_placeholder")}
                      label={t("page:input_label")}
                      value={inputValue}
                      autoComplete="off"
                      ref={inputRef}
                      onChange={onInputChange}
                    />
                    <Text className="tw-text-right tw-text-xs tw-font-bold tw-mt-1">
                      {t("page:results_title")} [{songsList.length}]
                    </Text>
                  </Block>
                  <Space size={2} />

                  <Block className="tw-flex tw-flex-wrap tw-justify-between">
                    {songsList.map((song) => {
                      return (
                        <Block key={song.id} className="tw-w-full tw-mb-4 sm:tw-w-5/12">
                          <Link
                            variant={Link.variant.SECONDARY}
                            href={`${ROUTES.MUSIC}/${song.id}`}
                            className={classNames(
                              "sm:tw-truncate",
                              !song.isPublic && "tw-line-through",
                            )}
                            title={song.title}
                            locale={I18nService.getDefaultLocale()}
                          >
                            {song.title}
                          </Link>
                          <SongDetails song={song} />
                        </Block>
                      );
                    })}
                  </Block>
                </Block>
              </Block>
            );
          }}
        </Render>
      </MainLayout>
    </Page>
  );
}

export default MusicPage;

// --- Controller ---

function useController() {
  const { isLoading, error, data } = useQuery("music", MusicService.fetchSongsList);

  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  useDidMount(() => {
    function focusInput(e) {
      if ((e.metaKey || e.ctrlKey) && e.code === "KeyF") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    document.addEventListener("keydown", focusInput);

    return () => {
      document.removeEventListener("keydown", focusInput);
    };
  });

  function onInputChange(e) {
    setInputValue(e.currentTarget.value.toLowerCase());
  }

  function parseData(songs: T_Song[]) {
    return {
      chordsPage: songs[0],
      songsList: (AuthService.isUserLoggedIn() || AnalyticsService.isAnalyticsDisabled()
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
    inputRef,

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
