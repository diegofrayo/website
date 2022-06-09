import * as React from "react";
import classNames from "classnames";

import { Block, InlineText } from "~/components/primitive";
import { useQuery } from "~/hooks";
import http from "~/lib/http";
import type { T_ReactElement } from "~/types";
import { getRandomItem } from "~/utils/misc";
import { Render } from "~/components/shared";

function SongsPage(): T_ReactElement {
  const { data, isLoading, error } = useController();

  function getItemStyles(): string {
    const SIZES = ["tw-text-xs", "tw-text-base", "tw-text-2xl"];
    const WEIGHT = ["tw-font-bold", "tw-font-thin", "tw-font-normal"];
    const BORDER = ["tw-border-dotted", "tw-border-dashed", ""];

    return [getRandomItem(SIZES), getRandomItem(WEIGHT), getRandomItem(BORDER)].join(" ");
  }

  function getAlignStyles(): string {
    const DIRECTIONS = ["tw-text-left", "tw-text-center", "tw-text-right"];

    return getRandomItem(DIRECTIONS);
  }

  return (
    <Render
      data={data}
      isLoading={isLoading}
      error={error}
    >
      {(data: T_Data) => (
        <Block>
          {Object.entries(data).map(([songKey, songData]) => (
            <Block
              key={songKey}
              className="tw-mb-16"
            >
              {songData.lyrics.map((lyric, index) => (
                <Block
                  key={`${songKey}-${index}`}
                  className={classNames("tw-mb-2", getAlignStyles())}
                >
                  <InlineText
                    className={classNames(
                      "tw-mr-2 tw-border-b tw-leading-relaxed dfr-border-color-dark-strong dark:dfr-border-color-light-strong",
                      getItemStyles(),
                    )}
                  >
                    {lyric.text}
                  </InlineText>
                </Block>
              ))}
            </Block>
          ))}
        </Block>
      )}
    </Render>
  );
}

export default SongsPage;

// --- Controller ---

function useController(): T_UseController {
  const { isLoading, error, data } = useQuery<T_Data>("songs", async () => {
    const { data } = await http.post(
      `${process.env["NEXT_PUBLIC_ASSETS_SERVER_URL"]}/api/diegofrayo`,
      {
        path: "/assets",
        payload: "pages/personal/[page]/songs/data.json",
      },
    );

    return data;
  });

  return {
    isLoading,
    error,
    data,
  };
}

// --- Types ---

type T_UseController = {
  isLoading: boolean;
  error: unknown;
  data: T_Data | undefined;
};

type T_Data = Record<
  string,
  {
    title: string;
    artist: string;
    album: string;
    year: string;
    url: string;
    lyrics: T_Lyric[];
  }
>;

type T_Lyric = {
  text: string;
};
