import * as React from "react";

import { Block, Icon, Link, Text, Title as TitlePrimitive } from "~/components/primitive";
import { T_ReactElement } from "~/types";
import { isDevelopmentEnvironment } from "~/utils/misc";

export function HelloWorldMDX({ text }: { text: string }): T_ReactElement {
  return <Text className="tw-bg-red-200 tw-block tw-p-2 tw-text-red-700">{text}</Text>;
}

export function SpotifyPlaylist(): T_ReactElement {
  if (isDevelopmentEnvironment()) return null;

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

type T_GitHubRepoProps = {
  name: string;
  url: string;
  description: string;
};

export function GitHubRepo({ name, url, description }: T_GitHubRepoProps): T_ReactElement {
  return (
    <Block className="tw-text-right" data-markdown-block>
      <Link
        variant={Link.variant.SIMPLE}
        className="dfr-bg-color-primary dfr-border-color-primary dark:dfr-border-color-primary dark:dfr-bg-color-primary tw-flex sm:tw-inline-flex tw-p-4 tw-rounded-md tw-items-center tw-relative tw-pr-8 tw-border"
        href={url}
        isExternalUrl
      >
        <Icon icon={Icon.icon.GITHUB} wrapperClassName="tw-mr-3" size={32} withDarkModeBackground />
        <Block className="tw-flex-1 tw-text-left">
          <TitlePrimitive
            is="h3"
            className="tw-text-black dark:tw-text-white tw-text-base sm:tw-text-lg"
            variant={TitlePrimitive.variant.UNSTYLED}
          >
            {name}
          </TitlePrimitive>
          <Text className="tw-text-sm">{description}</Text>
        </Block>

        <Icon
          icon={Icon.icon.LINK}
          wrapperClassName="tw-absolute tw-top-2 tw-right-2"
          iconClassName="tw-text-black"
        />
      </Link>
    </Block>
  );
}
