import React from "react";

import { T_ReactElement } from "~/types";

export function HelloWorldMDX({ text }: { text: string }): T_ReactElement {
  return <p className="tw-bg-red-200 tw-block tw-p-2 tw-text-red-700 tw-rounded-md">{text}</p>;
}

export function SpotifyPlaylist(): T_ReactElement {
  return (
    <div className="tw-border-4 dfr-border-primary dark:tw-border-gray-700" data-markdown-block>
      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZF1EM1nsROE2cRZE"
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
      />
    </div>
  );
}
