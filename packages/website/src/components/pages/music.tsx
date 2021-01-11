import * as React from "react";
import classnames from "classnames";

import { TypeSiteTexts, TypeSong } from "~/types";

export function SongInfo({
  song,
  SiteTexts,
  className,
}: {
  song: TypeSong;
  SiteTexts: TypeSiteTexts;
  className?: string;
}): any {
  return (
    <section className={classnames("tw-text-sm tw-italic tw-mb-4", className)}>
      <section>
        <strong>{SiteTexts.page.current_locale.artist}:</strong>{" "}
        <span>{song.artist}</span>
      </section>
      <section>
        <strong>{SiteTexts.page.current_locale.album}:</strong> <span>{song.album}</span>
      </section>
    </section>
  );
}
