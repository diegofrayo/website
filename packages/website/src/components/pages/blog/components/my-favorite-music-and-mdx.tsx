import * as React from "react";

export function HelloWorldMDX({ text }: { text: string }): any {
  return <p className="tw-bg-red-200 tw-block tw-p-2 tw-text-red-700 tw-rounded-md">{text}</p>;
}

export function SpotifyPlaylist(): any {
  return (
    <div className="tw-border-4 tw-border-pink-400" data-markdown-block>
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