import * as React from "react";
import { useRouter } from "next/router";

import {
  Block,
  Button,
  Icon,
  Image,
  InlineText,
  Link,
  Space,
  Text,
  Title,
} from "~/components/primitive";
import { useOnWindowStopScroll } from "~/hooks";
import { useTranslation } from "~/i18n";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { E_Icons, T_ReactChildrenProp, T_ReactElement, T_WebsiteMetadata } from "~/types";
import { getScrollPosition, scrollToElement } from "~/utils/browser";
import { createArray } from "~/utils/misc";

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
  const { pathname } = useRouter();

  function getParentURL() {
    if (pathname === "/") return "";

    const urlParts = pathname.split("/");

    return urlParts.slice(0, urlParts.length - 1).join("/") + "/";
  }

  const parentUrl = getParentURL();

  return (
    <Block is="main">
      <Block className="dfr-max-w-layout tw-mx-auto tw-px-8">
        <Header />

        <Block id="body" className="tw-pt-16 tw-pb-32">
          {title && (
            <Block className="tw-text-center">
              {parentUrl && (
                <Link
                  variant={Link.variant.SIMPLE}
                  href={parentUrl}
                  className="dfr-text-color-strong dark:dfr-text-color-strong tw-block tw-underline tw-mb-4"
                >
                  {parentUrl}
                </Link>
              )}
              <Title
                is="h1"
                variant={Title.variant.UNSTYLED}
                className="dfr-text-color-strong dark:dfr-text-color-strong tw-text-3xl sm:tw-text-6xl tw-font-bold tw-mb-16 tw-uppercase"
              >
                {title}
              </Title>
            </Block>
          )}
          {children}
        </Block>
      </Block>

      <Footer showGoToTopButton={showGoToTopButton} />
    </Block>
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

  return (
    <Block is="footer" className="dfr-bg-color-strong tw-relative tw-pt-12 tw-pb-4">
      <Block className="dfr-max-w-layout tw-mx-auto tw-px-8">
        <TV />
        <Space size={16} />

        <Block className="tw-flex tw-flex-col tw-justify-center tw-items-center sm:tw-flex-row sm:tw-justify-between sm:tw-items-end">
          <Block>
            <FooterIcon url={`mailto:${WEBSITE_METADATA.email}`} icon={Icon.icon.GMAIL} />
            <FooterIcon url={WEBSITE_METADATA.social.github} icon={Icon.icon.GITHUB} />
            <FooterIcon url={WEBSITE_METADATA.social.linkedin} icon={Icon.icon.LINKEDIN} />
            <FooterIcon url={WEBSITE_METADATA.social.spotify} icon={Icon.icon.SPOTIFY} />
            <FooterIcon url={WEBSITE_METADATA.social["500px"]} icon={Icon.icon["500PX"]} />
            <FooterIcon url={WEBSITE_METADATA.social.couchsurfing} icon={Icon.icon.COUCHSURFING} />
          </Block>
          <InlineText className="light:vd:dfr-text-color-strong tw-text-sm tw-leading-3 tw-mt-4 sm:tw-mt-0">
            {WEBSITE_METADATA.shortName} | {new Date().getFullYear()}
          </InlineText>
        </Block>
        <Space size={4} className="dfr-border-color-primary tw-border-b tw-border-opacity-30" />

        <Block className="tw-text-center tw-text-xs light:vd:dfr-text-color-strong">
          <InlineText is="strong">{t("layout:footer:resources_disclaimer")}:</InlineText>{" "}
          <Link
            variant={Link.variant.PRIMARY}
            className="tw-break-normal"
            href="https://heroicons.com"
            isExternalUrl
          >
            HeroIcons.com
          </Link>
          <InlineText> | </InlineText>
          <Link
            variant={Link.variant.PRIMARY}
            className="tw-break-normal"
            href="https://freeicons.io"
            isExternalUrl
          >
            freeicons.io
          </Link>
          <InlineText> | </InlineText>
          <Link
            variant={Link.variant.PRIMARY}
            className="tw-break-normal"
            href="https://icons8.com/illustrations"
            isExternalUrl
          >
            icons8.com
          </Link>
        </Block>
      </Block>

      {showGoToTopButton && <GoToTopButton />}
    </Block>
  );
}

function TV() {
  const SONG = {
    title: "Desarma y Sangra",
    artist: "Pedro Aznar",
    duration: "3:49",
    thumbnail: "http://i3.ytimg.com/vi/tO9p1ycgkgQ/hqdefault.jpg",
    source: "youtube",
    url: "https://youtu.be/tO9p1ycgkgQ",
  };

  return (
    <Block className="dfr-TV tw-flex tw-items-center tw-p-2 tw-bg-gradient-to-r tw-from-gray-800 tw-to-gray-900 tw-w-48 tw-max-w-full tw-mx-auto tw-relative">
      <Block className="tw-relative">
        <Link
          variant={Link.variant.SIMPLE}
          href={SONG.url}
          className="tw-relative tw-block"
          isExternalUrl
        >
          <Image
            src={SONG.thumbnail}
            className="tw-h-36 tw-w-36 tw-block tw-object-cover tw-rounded-md"
          />
          <Text
            className="light:vd:dfr-text-color-strong tw-font-bold tw-truncate tw-absolute  tw-w-full tw-px-1 tw-left-0 tw-text-center tw-bg-black tw-pt-0.5 tw-h-4 tw-transition-opacity tw-duration-500 tw-opacity-0 tw-text-xs tw-top-0"
            title={SONG.title}
          >
            {SONG.title}
          </Text>
          <Text
            className="dfr-text-color-secondary tw-font-bold tw-truncate tw-absolute tw-w-full tw-px-1 tw-left-0 tw-text-center tw-bg-black tw-pt-0.5 tw-h-4 tw-transition-opacity tw-duration-500 tw-opacity-0 tw-text-xxs tw-bottom-0"
            title={SONG.artist}
          >
            {SONG.artist}
          </Text>
        </Link>
      </Block>
      <Space size={1} orientation="v" />

      <Block className="tw-flex-1 tw-text-center">
        {createArray(8).map((i) => {
          return <Block key={`Volume-${i}`} className="tw-border tw-border-gray-700 tw-my-1" />;
        })}
        <Space size={4} />

        <Icon icon={SONG.source === "youtube" ? Icon.icon.YOUTUBE : Icon.icon.SPOTIFY} size={18} />
        <Block className="tw-rounded-full tw-h-4 tw-w-4 tw-border-2 tw-border-gray-600 tw-bg-gray-700 tw-mx-auto" />
      </Block>

      <style jsx>{`
        :global(.dfr-TV)::before,
        :global(.dfr-TV)::after {
          @apply tw-bg-gradient-to-r;
          @apply tw-from-gray-800;
          @apply tw-to-gray-900;
          content: " ";
          display: block;
          height: 16px;
          position: absolute;
          top: 100%;
          width: 16px;
        }

        :global(.dfr-TV)::before {
          left: 25%;
        }

        :global(.dfr-TV)::after {
          right: 25%;
        }

        :global(.dfr-TV) :global(.dfr-Link):hover :global(.dfr-Text) {
          opacity: 1;
        }
      `}</style>
    </Block>
  );
}

function FooterIcon({ icon, url }: { icon: E_Icons; url: string }): T_ReactElement {
  return (
    <Link
      variant={Link.variant.SIMPLE}
      href={url}
      className="tw-inline-block tw-mr-2 last:tw-mr-0"
      isExternalUrl
    >
      <Icon icon={icon} wrapperClassName="light:vd:dfr-bg-color-strong tw-rounded-full tw-p-2" />
    </Link>
  );
}

function GoToTopButton(): T_ReactElement {
  const [showGoToTopButton, setShowGoToTopButton] = React.useState<boolean>(false);

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
      variant={Button.variant.SIMPLE}
      className="dfr-bg-color-strong tw-bg-opacity-70 tw-fixed tw-text-2xl tw-bottom-3 tw-right-3 tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center sm:tw-right-4 sm:tw-bottom-4"
      onClick={() => {
        scrollToElement(document.getElementById("go-to-body-icon"));
      }}
    >
      <Icon icon={Icon.icon.ARROW_UP} color="light:vd:dfr-text-color-strong" />
    </Button>
  );
}
