import React from "react";

import { Icon, Image, Link, List, Title } from "~/components/primitive";
import { T_ReactElement, T_Song } from "~/types";
import { sortBy } from "~/utils/misc";

type T_SongSources = {
  sources: T_Song["sources"];
};

function SongSources(props: T_SongSources): T_ReactElement {
  const { sources, getImageComponent } = useController(props);

  if (sources.length === 0) return null;

  return (
    <section>
      <Title is="h2" className="tw-mb-2">
        Fuentes
      </Title>

      <List>
        {sources.map((source, index) => {
          const ImageComponent = getImageComponent(source.source);

          return (
            <List.Item key={`SongSources-Link-source-${index}`}>
              <Link
                href={source.url}
                className="tw-flex tw-items-center tw-py-1"
                variant={Link.variant.SIMPLE}
              >
                <ImageComponent />
                <div className="tw-flex-1 tw-min-w-0">
                  <p
                    className="tw-font-bold tw-text-sm tw-text-black dark:tw-text-white tw-truncate"
                    title={source.text}
                  >
                    {source.text}
                  </p>
                  <p className="tw-text-xs tw-italic">{source.source}</p>
                </div>
              </Link>
            </List.Item>
          );
        })}
      </List>
    </section>
  );
}

export default SongSources;

// --- Controller ---

function useController({ sources }: T_SongSources) {
  function getImageComponent(source: string) {
    if (source.includes("lacuerda")) {
      return function ImageComponent() {
        return (
          <Image
            src="/static/images/misc/lacuerda.png"
            alt="La cuerda icon"
            className="tw-w-8 tw-h-8 tw-mr-2 tw-rounded-full"
          />
        );
      };
    }

    const icon =
      source === "youtube"
        ? Icon.icon.YOUTUBE
        : source === "spotify"
        ? Icon.icon.SPOTIFY
        : Icon.icon.LINK;

    return function ImageComponent() {
      return <Icon icon={icon} size="tw-w-8 tw-h-8" wrapperClassName="tw-mr-2" />;
    };
  }

  return {
    sources: sources.sort(
      sortBy([
        { param: "source", order: "asc" },
        { param: "title", order: "asc" },
      ]),
    ),
    getImageComponent,
  };
}
