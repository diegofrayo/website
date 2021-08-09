import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Title as TitlePrimitive, Icon, Button, Link } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { safeRender } from "~/hocs";
import { useOnWindowScroll } from "~/hooks";
import { useTranslation } from "~/i18n";
import { useStoreSelector } from "~/state";
import { selectPageConfig } from "~/state/modules/ui";
import { T_Locale, T_ReactElement, T_UIReducer } from "~/types";
import { getScrollPosition } from "~/utils/browser";

function DefaultHeader(): T_ReactElement {
  const [isHeaderFixed, setIsFixedHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useOnWindowScroll(() => {
    if (!headerRef.current) return;

    const scrollPosition = getScrollPosition();

    if (scrollPosition > headerRef.current.offsetHeight) {
      setIsFixedHeader(true);
    } else if (isHeaderFixed && scrollPosition <= headerRef.current.offsetHeight) {
      setIsFixedHeader(false);
    }
  });

  return (
    <header ref={headerRef}>
      {isHeaderFixed ? <FixedHeaderContent /> : <DefaultHeaderContent />}
    </header>
  );
}

function HomeHeader(): T_ReactElement {
  return (
    <header>
      <DefaultHeaderContent background="tw-bg-transparent" />
    </header>
  );
}

export { DefaultHeader, HomeHeader };

// --- Components ---

function DefaultHeaderContent({ background = "tw-bg-blue-500 dark:tw-bg-black" }): T_ReactElement {
  return (
    <div className={classNames("tw-h-96 tw-text-center", background)}>
      <div className="tw-pt-4 tw-pb-7">
        <DarkModeToggle />
        <LocalesToggle />
      </div>
      <Logo className="tw-w-32 tw-h-32 tw-mx-auto tw-mb-4 tw-border-black" />
      <Title className="tw-text-black dark:dfr-text-color-secondary" />
      <Subtitle className="tw-text-white" />
    </div>
  );
}

function FixedHeaderContent(): T_ReactElement {
  return (
    <div className="root tw-w-full tw-fixed tw-left-0 tw-top-0 tw-z-30 tw-shadow-sm dark:tw-shadow-none dark:tw-border-b dark:tw-border-gray-700">
      <div className="tw-max-w-screen-md tw-mx-auto tw-py-4 tw-px-6">
        <div className="tw-flex tw-items-center tw-w-full tw-h-full tw-min-h-0">
          <Logo
            className="tw-w-12 sm:tw-w-16 tw-h-12 sm:tw-h-16 tw-border-black dark:tw-border-gray-700"
            border="tw-border-0 tw-p-0"
          />
          <div className="tw-mx-4 tw-flex-1">
            <Title className="tw-text-black dark:dfr-text-color-secondary" />
            <Subtitle className="tw-hidden sm:tw-block" />
          </div>
          <DarkModeToggle />
        </div>
      </div>

      <style jsx>{`
        .root {
          background-color: rgba(255, 255, 255, 0.95);
        }

        :global(.tw-dark) .root {
          background-color: rgba(40, 44, 52, 0.95);
        }
      `}</style>
    </div>
  );
}

function Logo({ className = "", border = "tw-border-4 tw-p-0.5" }): T_ReactElement {
  return (
    <Link href="/" variant={Link.variant.SIMPLE} className="tw-inline-block" isNextLink>
      <img
        src="/static/images/misc/avatar.png"
        alt="Profile picture"
        className={classNames("tw-rounded-full tw-shadow-md", className, border)}
      />
    </Link>
  );
}

function Title({ className = "" }): T_ReactElement {
  return (
    <Link href="/" variant={Link.variant.SIMPLE} className="tw-block" isNextLink>
      <TitlePrimitive
        is="h1"
        className={className}
        size={TitlePrimitive.size.XL}
        variant={TitlePrimitive.variant.UNSTYLED}
      >
        Diego <Emoji className="tw-text-2xl">⚡</Emoji>
      </TitlePrimitive>
    </Link>
  );
}

function Subtitle({ className = "" }): T_ReactElement {
  const { t } = useTranslation();

  return (
    <p
      className={classNames("tw-text-sm tw-mt-1 tw-font-mono", className)}
      dangerouslySetInnerHTML={{ __html: t("layout:header:role") }}
    />
  );
}

const DarkModeToggle = safeRender(function DarkModeToggle(): T_ReactElement {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <Button
      className="tw-relative tw-inline-flex tw-h-6 tw-w-12 tw-rounded-xl tw-shadow-md dfr-bg-secondary dark:dfr-bg-secondary"
      onClick={() => {
        setTheme(isDarkMode ? "light" : "dark");
      }}
    >
      <span
        className={classNames(
          "tw-rounded-full tw-p-1 tw-w-7 tw-h-7 tw-absolute tw--top-0.5 tw-flex tw-items-center tw-justify-center tw-bg-white tw-shadow-md tw-border-t tw-border-l dfr-border-color-primary dark:tw-border-0",
          isDarkMode ? "tw--right-0.5" : "tw--left-0.5",
        )}
      >
        <Icon
          icon={Icon.icon.SUN}
          wrapperClassName={classNames("tw-relative tw--left-1px", isDarkMode && "tw-hidden")}
        />
        <Icon icon={Icon.icon.MOON} wrapperClassName={classNames(!isDarkMode && "tw-hidden")} />
      </span>
    </Button>
  );
});

function LocalesToggle(): T_ReactElement {
  const { locale, asPath } = useRouter();
  const { locales: pageLocales, reloadLocaleUpdate } =
    useStoreSelector<T_UIReducer>(selectPageConfig);

  const EMOJIS = { es: "🇪🇸", en: "🇺🇸" };

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-mt-1 tw-leading-0">
      <Emoji className="tw-text-lg tw-relative tw-top-1px">🌐</Emoji>
      <span className="tw-text-white tw-ml-0.5 tw-mr-2">»</span>
      {pageLocales.map((item) => {
        return (
          <Link
            key={`LocalesToggle-item-${item}`}
            href={asPath}
            locale={item as T_Locale}
            variant={Link.variant.SIMPLE}
            className={classNames(
              "tw-text-2xl tw-mr-1",
              item === locale ? "tw-pointer-events-none" : "tw-opacity-50",
            )}
            isNextLink={true}
            {...(reloadLocaleUpdate && {
              external: false,
              href: `/${item}${asPath}`,
              isNextLink: false,
            })}
          >
            {EMOJIS[item]}
          </Link>
        );
      })}
    </div>
  );
}
