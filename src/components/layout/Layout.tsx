import React, { useState } from "react";
import { useRouter } from "next/router";

import { Button, Icon, Link, Space, Title } from "~/components/primitive";
import { useOnWindowStopScroll } from "~/hooks";
import { useTranslation } from "~/i18n";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { E_Icons, T_ReactChildrenProp, T_ReactElement, T_WebsiteMetadata } from "~/types";
import { getScrollPosition, setScrollPosition } from "~/utils/browser";
import { isBrowser } from "~/utils/misc";

import Header from "./Header";

type T_MainLayoutProps = {
  title: string;
  children: T_ReactChildrenProp;
  showGoToTopButton?: boolean;
};

function MainLayout({
  children,
  title = "",
  showGoToTopButton = true,
}: T_MainLayoutProps): T_ReactElement {
  const { asPath } = useRouter();

  function getParentLevelURL() {
    if (isBrowser()) {
      console.log({ asPath, href: window.location.href });
    }

    if (asPath === "/") return "";

    const urlParts = asPath.split("/");

    return urlParts.slice(0, urlParts.length - 1).join("/") + "/";
  }

  return (
    <main>
      <div className="dfr-max-w-base tw-mx-auto tw-px-8">
        <Header />

        <div id="body" className="tw-pt-16 tw-pb-32">
          {title && (
            <div className="tw-text-center">
              <Link
                variant={Link.variant.SECONDARY}
                href={getParentLevelURL()}
                className="tw-block tw-underline tw-mb-4"
                isNextLink
              >
                {getParentLevelURL()}
              </Link>
              <Title
                is="h1"
                variant={Title.variant.UNSTYLED}
                className="dfr-text-strong dark:dfr-text-strong tw-text-3xl sm:tw-text-6xl tw-font-bold tw-mb-16 tw-uppercase"
              >
                {title}
              </Title>
            </div>
          )}
          {children}
        </div>
      </div>

      <Footer showGoToTopButton={showGoToTopButton} />
    </main>
  );
}

export default MainLayout;

// --- Components ---

function Footer({
  showGoToTopButton,
}: {
  showGoToTopButton: T_MainLayoutProps["showGoToTopButton"];
}): T_ReactElement {
  const { t } = useTranslation();
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  const SONGS = [
    {
      title: "Un Pacto",
      artist: "Cóndor Sbarbati",
      duration: "4:30",
      thumbnail: "http://i3.ytimg.com/vi/WNebXvrqGDE/maxresdefault.jpg",
      source: "youtube",
      url: "https://youtu.be/WNebXvrqGDE",
    },
    {
      title: "Rock para el Negro Atila",
      artist: "Patricio Rey y sus Redonditos de Ricota",
      duration: "4:00",
      thumbnail: "https://i.scdn.co/image/ab67616d0000b273074392d2ae6b119d67289def",
      source: "spotify",
      url: "https://open.spotify.com/track/1JQOUueUnq9xoUcI1MiVVy?si=562c9fd52fa54957",
    },
  ];

  const song = SONGS[1];

  return (
    <footer className="dfr-bg-strong tw-relative tw-pt-12 tw-pb-4">
      <div className="dfr-max-w-base tw-mx-auto tw-px-8">
        <div className="tw-w-96 tw-max-w-full tw-mx-auto">
          <p className="dfr-text-colorful-primary tw-font-bold tw-text-xs tw-text-right">
            on repeat...
          </p>
          <Link
            variant={Link.variant.SIMPLE}
            href={song.url}
            className="dfr-border-primary tw-border-opacity-30 tw-flex tw-items-center tw-text-sm tw-border tw-p-1 tw-bg-gradient-to-r tw-from-gray-800 tw-to-gray-900 tw-relative"
          >
            <img src={song.thumbnail} className="tw-h-20 tw-w-20 tw-object-cover tw-mr-2" />
            <div className="tw-flex-1 tw-min-w-0">
              <p
                className="dfr-text-strong-inverted tw-font-bold tw-truncate tw-text-base"
                title={song.title}
              >
                {song.title}
              </p>
              <p
                className="dfr-text-secondary tw-font-bold tw-truncate tw-text-sm"
                title={song.artist}
              >
                {song.artist}
              </p>
              <p className="dfr-text-secondary tw-italic tw-text-xs">{song.duration}</p>
            </div>
            <Icon
              wrapperClassName="tw-absolute tw-right-1 tw-bottom-1"
              icon={song.source === "youtube" ? Icon.icon.YOUTUBE : Icon.icon.SPOTIFY}
              size={20}
            />
          </Link>
        </div>
        <Space size={16} />

        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center sm:tw-flex-row sm:tw-justify-between sm:tw-items-end">
          <div>
            <FooterIcon url={`mailto:${WEBSITE_METADATA.email}`} icon={Icon.icon.GMAIL} />
            <FooterIcon url={WEBSITE_METADATA.social.github} icon={Icon.icon.GITHUB} />
            <FooterIcon url={WEBSITE_METADATA.social.linkedin} icon={Icon.icon.LINKEDIN} />
            <FooterIcon url={WEBSITE_METADATA.social.twitter} icon={Icon.icon.TWITTER} />
            <FooterIcon url={WEBSITE_METADATA.social.spotify} icon={Icon.icon.SPOTIFY} />
            <FooterIcon url={WEBSITE_METADATA.social["500px"]} icon={Icon.icon["500PX"]} />
            <FooterIcon url={WEBSITE_METADATA.social.couchsurfing} icon={Icon.icon.COUCHSURFING} />
          </div>
          <span className="dfr-text-strong-inverted tw-text-sm tw-leading-3 tw-mt-4 sm:tw-mt-0">
            {WEBSITE_METADATA.shortName} | {new Date().getFullYear()}
          </span>
        </div>
        <Space size={4} className="dfr-border-primary tw-border-b tw-border-opacity-30" />

        <div className="tw-text-center tw-text-xs dfr-text-strong-inverted">
          <strong>{t("layout:footer:resources_disclaimer")}:</strong>{" "}
          <Link className="tw-break-normal" href="https://heroicons.com" external>
            HeroIcons.com
          </Link>
          <span> | </span>
          <Link className="tw-break-normal" href="https://freeicons.io" external>
            freeicons.io
          </Link>
          <span> | </span>
          <Link className="tw-break-normal" href="https://icons8.com/illustrations" external>
            icons8.com
          </Link>
        </div>
      </div>

      {showGoToTopButton && <GoToTopButton />}
    </footer>
  );
}

function FooterIcon({ icon, url }: { icon: E_Icons; url: string }): T_ReactElement {
  return (
    <Link href={url} className="tw-mr-1 sm:tw-mr-2 last:tw-mr-0 tw-inline-block">
      <Icon icon={icon} wrapperClassName="dfr-bg-strong-inverted tw-rounded-full tw-p-2" />
    </Link>
  );
}

function GoToTopButton(): T_ReactElement {
  const [showGoToTopButton, setShowGoToTopButton] = useState<boolean>(false);

  useOnWindowStopScroll({
    onScrollStoppedCallback: () => {
      setShowGoToTopButton(false);
    },
    onScrollCallback: () => {
      if (getScrollPosition() > 0) {
        setShowGoToTopButton(true);
      } else {
        setShowGoToTopButton(false);
      }
    },
  });

  if (!showGoToTopButton) return null;

  return (
    <Button
      className="dfr-bg-strong tw-bg-opacity-70 tw-fixed tw-text-2xl tw-bottom-3 sm:tw-bottom-4 tw-right-3 sm:tw-right-4 tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center"
      onClick={() => {
        setScrollPosition(0);
      }}
    >
      <Icon icon={Icon.icon.ARROW_UP} color="dfr-text-strong-inverted" />
    </Button>
  );
}
