import * as React from "react";

import { Block, Text } from "~/components/primitive";
import { T_ReactElement } from "~/types";

export function HelloWorldMDX({ text }: { text: string }): T_ReactElement {
  return <Text className="tw-bg-red-200 tw-block tw-p-2 tw-text-red-700">{text}</Text>;
}

export function SpotifyPlaylist(): T_ReactElement {
  return (
    <Block className="dfr-border-color-dark-strong tw-border-4" data-markdown-block>
      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZF1EM1nsROE2cRZE"
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
      />
    </Block>
  );
}
