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
import { ROUTES } from "~/utils/routing";
import { exists } from "~/utils/validations";
import type { T_ReactElement, T_ReactOnChangeEventHandler, T_ReactRefObject } from "~/types";

import MusicService, { T_Song } from "./service";

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
    onInputChangeHandler,

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
        <Render
          isLoading={isLoading}
          error={error}
          data={data}
        >
          {(data: unknown): T_ReactElement => {
            const { chordsPage, songsList } = parseData(data as T_Song[]);

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
                <Space
                  size={6}
                  variant={Space.variant.DASHED}
                />

                <Block variant="FEATURED">
                  <Text>{t("page:description_2")}</Text>
                  <Space
                    size={6}
                    variant={Space.variant.DASHED}
                  />

                  <Block>
                    <Input
                      id="input"
                      type="text"
                      placeholder={t("page:input_placeholder")}
                      label={t("page:input_label")}
                      value={inputValue}
                      autoComplete="off"
                      ref={inputRef}
                      onChange={onInputChangeHandler}
                    />
                    <Text className="tw-mt-1 tw-text-right tw-text-xs tw-font-bold">
                      {t("page:results_title")} [{songsList.length}]
                    </Text>
                  </Block>
                  <Space size={2} />

                  <Block className="tw-flex tw-flex-wrap tw-justify-between">
                    {songsList.map((song) => {
                      return (
                        <Block
                          key={song.id}
                          className={classNames(
                            "tw-mb-6 tw-w-full sm:tw-w-5/12",
                            !song.isPublic && "tw-opacity-50",
                          )}
                        >
                          <Link
                            variant={Link.variant.SECONDARY}
                            href={`${ROUTES.MUSIC}/${song.id}`}
                            className="sm:tw-truncate"
                            title={song.title}
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

type T_UseController = {
  inputValue: string;
  inputRef: T_ReactRefObject<HTMLInputElement>;
  isLoading: boolean;
  error: unknown;
  data: T_Song[] | undefined;
  onInputChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
  parseData: (songs: T_Song[]) => {
    chordsPage: T_Song;
    songsList: T_Song[];
  };
};

function useController(): T_UseController {
  // hooks
  const { isLoading, error, data } = useQuery("music", MusicService.fetchSongsList);

  // states & refs
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // effects
  useDidMount(() => {
    const focusInput = function focusInput(event: KeyboardEvent): void {
      if (
        exists<HTMLInputElement>(inputRef.current) &&
        (event.metaKey || event.ctrlKey) &&
        event.code === "KeyF"
      ) {
        event.preventDefault();
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", focusInput);

    return () => {
      document.removeEventListener("keydown", focusInput);
    };
  });

  // handlers
  const onInputChangeHandler: T_UseController["onInputChangeHandler"] =
    function onInputChangeHandler(event) {
      setInputValue(event.currentTarget.value.toLowerCase());
    };

  // utils
  const parseData: T_UseController["parseData"] = function parseData(songs) {
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
  };

  return {
    // states
    inputValue,
    inputRef,

    // vars
    isLoading,
    error,
    data,

    // handlers
    onInputChangeHandler,

    // utils
    parseData,
  };
}
