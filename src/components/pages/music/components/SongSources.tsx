import * as React from "react";

import { Icon, Image, Link, List, Title, Block, Text } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import type { T_ReactElement, T_Song } from "~/types";

type T_SongSourcesProps = {
  sources: T_Song["sources"];
};

function SongSources(props: T_SongSourcesProps): T_ReactElement {
  const { sources, getImageComponent } = useController(props);
  const { t } = useTranslation();

  if (sources.length === 0) return null;

  return (
    <Block>
      <Title is="h2">{t("page:sources")}</Title>

      <Text className="tw-my-2 tw-text-sm tw-italic">{t("page:disclaimer")}</Text>

      <List variant={List.variant.UNSTYLED}>
        {sources.map((source, index) => {
          const ImageComponent = getImageComponent(source.source);

          return (
            <List.Item
              key={`SongSources-Link-source-${index}`}
              className="tw-mb-2 last:tw-mb-0"
            >
              <Link
                variant={Link.variant.SIMPLE}
                href={source.url}
                className="tw-flex tw-items-center tw-py-0.5"
                isExternalLink
              >
                <ImageComponent />
                <Block className="tw-min-w-0 tw-flex-1">
                  <Text
                    className="tw-truncate tw-text-sm tw-font-bold tw-text-black dark:tw-text-white"
                    title={source.text}
                  >
                    {source.text}
                  </Text>
                  <Text className="tw-text-xs tw-italic">{source.source}</Text>
                </Block>
              </Link>
            </List.Item>
          );
        })}
      </List>
    </Block>
  );
}

export default SongSources;

// --- Controller ---

function useController({ sources }: T_SongSourcesProps) {
  function getImageComponent(source: string) {
    if (source.includes("lacuerda")) {
      return function ImageComponent() {
        return (
          <Image
            src="/static/images/misc/lacuerda.png"
            alt="La cuerda icon"
            className="tw-mr-2 tw-h-8 tw-w-8 tw-rounded-full"
          />
        );
      };
    }

    const icon =
      source === "youtube"
        ? Icon.icon.YOUTUBE
        : source === "spotify"
        ? Icon.icon.SPOTIFY
        : source === "instagram"
        ? Icon.icon.INSTAGRAM
        : Icon.icon.LINK;

    return function ImageComponent() {
      return (
        <Icon
          icon={icon}
          size="tw-w-8 tw-h-8"
          wrapperClassName="tw-mr-2"
        />
      );
    };
  }

  return {
    sources,
    getImageComponent,
  };
}
