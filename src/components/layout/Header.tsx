import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Title as TitlePrimitive, Icon, Button, Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { safeRender } from "~/hocs";
import { useDidMount, useOnWindowScroll, useToggleBodyScroll } from "~/hooks";
import { useTranslation } from "~/i18n";
import { useStoreSelector } from "~/state";
import { selectPageConfig } from "~/state/modules/ui";
import { T_Locale, T_PageRoute, T_ReactElement, T_UI } from "~/types";
import { getScrollPosition } from "~/utils/browser";
import { isUserLoggedIn } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";

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
    <header className="tw-h-96" ref={headerRef}>
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
    <div className={classNames("tw-h-full tw-text-center", background)}>
      <ToggleMenu />
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
  const { locales: pageLocales, reloadWhenLocaleChanges } =
    useStoreSelector<T_UI>(selectPageConfig);

  const EMOJIS = { es: "🇪🇸", en: "🇺🇸" };

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-mt-1 tw-leading-0">
      <Emoji className="tw-text-lg tw-relative tw-top-1px">🌐</Emoji>
      <span className="tw-text-white tw-ml-0.5 tw-mr-2">»</span>
      {pageLocales.map((item) => {
        return (
          <Link
            key={item}
            href={asPath}
            locale={item as T_Locale}
            variant={Link.variant.SIMPLE}
            className={classNames(
              "tw-text-2xl tw-mr-1",
              item === locale ? "tw-pointer-events-none" : "tw-opacity-50",
            )}
            isNextLink={true}
            {...(reloadWhenLocaleChanges && {
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

function ToggleMenu() {
  const { t } = useTranslation();

  const [showMenu, setShowMenu] = useState(false);
  const [items, setItems] = useState<
    {
      emoji: any;
      label: any;
      url: T_PageRoute;
      locale?: T_Locale;
    }[]
  >([
    {
      emoji: t("layout:header:common:menu_item_music_emoji"),
      label: t("layout:header:menu:music"),
      url: ROUTES.MUSIC,
      locale: undefined,
    },
    {
      emoji: t("layout:header:common:menu_item_blog_emoji"),
      label: t("layout:header:common:menu_item_blog"),
      url: ROUTES.BLOG,
      locale: undefined,
    },
    {
      emoji: t("layout:header:common:menu_item_about_me_emoji"),
      label: t("layout:header:menu:about_me"),
      url: ROUTES.ABOUT_ME,
      locale: undefined,
    },
    {
      emoji: t("layout:header:common:menu_item_resume_emoji"),
      label: t("layout:header:menu:resume"),
      url: ROUTES.RESUME,
      locale: undefined,
    },
    {
      emoji: t("layout:header:common:menu_item_contact_emoji"),
      label: t("layout:header:menu:contact"),
      url: ROUTES.CONTACT,
      locale: undefined,
    },
  ]);

  useToggleBodyScroll(showMenu);

  useDidMount(() => {
    if (isUserLoggedIn()) {
      setItems([
        ...items,
        {
          emoji: t("layout:header:common:menu_item_playground_emoji"),
          label: t("layout:header:common:menu_item_playground"),
          url: ROUTES.PLAYGROUND,
          locale: "es",
        },
      ]);
    }
  });

  return (
    <div className="tw-absolute tw-top-1 tw-left-1">
      <Button onClick={() => setShowMenu(true)}>
        <Icon icon={Icon.icon.MENU} color="tw-text-white" size={48} />
      </Button>

      {showMenu && (
        <div className="tw-bg-white dark:tw-bg-black tw-fixed tw-h-screen tw-w-screen tw-z-40 tw-overflow-auto tw-block sm:tw-flex tw-justify-center tw-items-center tw-top-0 tw-left-0 tw-py-4">
          <Button
            className="tw-fixed tw-top-2 tw-right-2 tw-text-lg tw-text-black"
            onClick={() => setShowMenu(false)}
          >
            <Icon icon={Icon.icon.X} color="tw-text-black dark:tw-text-white" size={48} />
          </Button>

          <List variant={List.variant.UNSTYLED} className="sm:tw-mx-auto tw-w-4/5 tw-pl-4">
            {items.map((item) => {
              return (
                <List.Item key={generateSlug(item.label)}>
                  <Link
                    href={item.url}
                    variant={Link.variant.SIMPLE}
                    className="tw-flex tw-justify-start sm:tw-justify-center tw-items-center tw-p-3 tw-text-black dark:tw-text-white tw-text-2xl"
                    locale={item.locale}
                    onClick={() => setShowMenu(false)}
                    isNextLink
                  >
                    <Emoji className="tw-mr-2 tw-inline-block">{item.emoji}</Emoji>
                    <strong className="tw-text-center">{item.label}</strong>
                    <Emoji className="tw-ml-2 tw-hidden sm:tw-inline-block">{item.emoji}</Emoji>
                  </Link>
                </List.Item>
              );
            })}
          </List>
        </div>
      )}
    </div>
  );
}
