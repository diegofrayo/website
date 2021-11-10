import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Link, Title, Space, Input, Text, InlineText, Block } from "~/components/primitive";
import { Emoji, Render } from "~/components/shared";
import { SongDetails } from "~/components/pages/music/components";
import { AuthService } from "~/auth";
import { useDidMount, useQuery } from "~/hooks";
import { getPageContentStaticProps, I18nService, useTranslation } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import MusicService from "~/services/music";
import { T_ReactElement, T_Song } from "~/types";
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
        <Text>{t("page:description")}</Text>
        <Space size={2} />

        <Render isLoading={isLoading} error={error} data={data}>
          {(data: T_Song[]) => {
            const { chordsPage, songsList } = parseData(data);

            return (
              <Block>
                <Link
                  variant={Link.variant.SECONDARY}
                  href={`${ROUTES.MUSIC}/${chordsPage.id}`}
                  locale={I18nService.getDefaultLocale()}
                >
                  <Emoji className="tw-mr-2">📓</Emoji>
                  <InlineText className="tw-underline">{t("page:chords_title")}</InlineText>
                </Link>
                <Space sizeTop={6} sizeBottom={16} variant={Space.variant.DASHED} />

                <Title is="h2" variant={Title.variant.SECONDARY} size={Title.size.MD} className="">
                  <Emoji className="tw-mr-2">🎶</Emoji>
                  <InlineText>
                    {t("page:songs_title")} [{songsList.length}]
                  </InlineText>
                </Title>

                <Input
                  id="input"
                  type="text"
                  containerProps={{ className: "tw-mt-4 tw-mb-6" }}
                  placeholder={t("page:input_placeholder")}
                  value={inputValue}
                  autoComplete="off"
                  ref={inputRef}
                  onChange={onInputChange}
                />

                <Block className="tw-flex tw-flex-wrap tw-justify-between">
                  {songsList.map((song) => {
                    return (
                      <Block key={song.id} className="tw-w-full sm:tw-w-5/12 tw-mb-3">
                        <Link
                          variant={Link.variant.SECONDARY}
                          href={`${ROUTES.MUSIC}/${song.id}`}
                          className="tw-flex"
                          locale={I18nService.getDefaultLocale()}
                        >
                          <InlineText
                            className={classNames(
                              "tw-flex-1 sm:tw-truncate",
                              !song.isPublic && "tw-line-through",
                            )}
                            title={song.title}
                          >
                            {song.title}
                          </InlineText>
                        </Link>
                        <SongDetails song={song} />
                      </Block>
                    );
                  })}
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

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.MUSIC,
});

// --- Controller ---

function useController() {
  const { isLoading, error, data } = useQuery("songsList", MusicService.fetchSongsList);

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
