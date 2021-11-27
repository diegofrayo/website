import * as React from "react";
import { useRouter } from "next/router";

import { Block, Button, Icon, InlineText, Link, Space, Title } from "~/components/primitive";
import { useOnWindowStopScroll } from "~/hooks";
import { useTranslation } from "~/i18n";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { E_Icons, T_ReactChildrenProp, T_ReactElement, T_WebsiteMetadata } from "~/types";
import { getScrollPosition, scrollToElement } from "~/utils/browser";

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
                  className="dfr-text-color-dark-strong tw-block tw-underline tw-mb-4 dark:dfr-text-color-light-strong"
                >
                  {parentUrl}
                </Link>
              )}
              <Title
                is="h1"
                variant={Title.variant.UNSTYLED}
                className="dfr-text-color-dark-strong tw-text-3xl sm:tw-text-6xl tw-font-bold tw-mb-16 tw-uppercase dark:dfr-text-color-light-strong"
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
    <Block is="footer" className="dfr-bg-color-dark-strong tw-relative tw-text-center">
      <Block className="dfr-max-w-layout tw-mx-auto tw-px-8">
        <Block className="tw-py-16">
          <Block>
            <FooterIcon url={`mailto:${WEBSITE_METADATA.email}`} icon={Icon.icon.GMAIL} />
            <FooterIcon url={WEBSITE_METADATA.social.github} icon={Icon.icon.GITHUB_LIGHT} />
            <FooterIcon url={WEBSITE_METADATA.social.twitter} icon={Icon.icon.TWITTER} />
            <FooterIcon url={WEBSITE_METADATA.social["500px"]} icon={Icon.icon["500PX"]} />
            <FooterIcon url={WEBSITE_METADATA.social.couchsurfing} icon={Icon.icon.COUCHSURFING} />
            {/*
            <FooterIcon url={WEBSITE_METADATA.social.spotify} icon={Icon.icon.SPOTIFY} />
            <FooterIcon url={WEBSITE_METADATA.social.linkedin} icon={Icon.icon.LINKEDIN} />
            */}
          </Block>
        </Block>
        <Space size={0} className="dfr-border-color-primary tw-border-b tw-border-opacity-20" />
        <Block className="dfr-text-color-light-strong tw-py-2 tw-tdext-right tw-text-xxs">
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

function FooterIcon({ icon, url }: { icon: E_Icons; url: string }): T_ReactElement {
  return (
    <Link
      variant={Link.variant.SIMPLE}
      href={url}
      className="tw-inline-block tw-mr-2 sm:tw-mr-4 last:tw-mr-0"
      isExternalUrl
    >
      <Icon
        icon={icon}
        wrapperClassName="dfr-bg-color-light-strong dfr-border-color-light-strong tw-border tw-bg-opacity-10 tw-border-opacity-10 tw-rounded-full tw-p-2"
        size="tw-w-4 tw-h-4 sm:tw-w-8
        sm:tw-h-8"
      />
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
      className="dfr-bg-color-dark-strong tw-bg-opacity-70 tw-fixed tw-text-2xl tw-bottom-3 tw-right-3 tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center sm:tw-right-4 sm:tw-bottom-4"
      onClick={() => {
        scrollToElement(document.getElementById("go-to-body-icon"));
      }}
    >
      <Icon icon={Icon.icon.ARROW_UP} color="dfr-text-color-light-strong" />
    </Button>
  );
}
