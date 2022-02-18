import * as React from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";
import { useRouter } from "next/router";

import {
  Block,
  Button,
  Icon,
  Image,
  InlineText,
  Link,
  List,
  Space,
  Text,
} from "~/components/primitive";
import { AuthService } from "~/auth";
import { withRequiredAuthComponent, withSafeRenderingComponent } from "~/hocs";
import { useClickOutside, useDidMount, useEnhacedState } from "~/hooks";
import { I18nService, useTranslation } from "~/i18n";
import { useStoreSelector } from "~/state";
import { selectPageConfig } from "~/state/modules/page-config";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import type {
  T_Locale,
  T_PageConfig,
  T_PageRoute,
  T_ReactChildrenProp,
  T_ReactElement,
  T_WebsiteMetadata,
} from "~/types";
import { scrollToElement, isPWA } from "~/utils/browser";
import { createArray, isDevelopmentEnvironment } from "~/utils/misc";
import { redirect, ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";

function Header(): T_ReactElement {
  const { asPath } = useRouter();
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  return (
    <Block
      is="header"
      className="tw-h-auto tw-py-8 sm:tw-flex sm:tw-h-screen sm:tw-flex-col sm:tw-justify-between"
    >
      <Block>
        <Block className="tw-flex tw-items-center tw-justify-between">
          <MainMenu />
          <Link
            variant={Link.variant.SECONDARY}
            href={ROUTES.HOME}
            className="tw-border-b-2 tw-border-dotted tw-text-sm dfr-border-color-dark-strong dark:dfr-border-color-light-strong"
          >
            {WEBSITE_METADATA.username}
          </Link>
          <SettingsMenu />
        </Block>
        <Block className="tw-text-center">
          <InlineText className="tw-text-xxs dfr-text-color-secondary dark:dfr-text-color-secondary">
            {asPath.split("?")[0].split("/").slice(0, 2).join("/")}
          </InlineText>
        </Block>
      </Block>
      <Space size={8} className="sw:tw-hidden" />

      <Room />
      <Space size={10} className="sw:tw-hidden" />

      <Button
        variant={Button.variant.SIMPLE}
        className="tw-mx-auto tw-block"
        id="go-to-body-icon"
        onClick={() => {
          scrollToElement(document.getElementById("body"));
        }}
      >
        <Icon icon={Icon.icon.CHEVRON_DOUBLE_DOWN} size={32} />
      </Button>

      <style jsx>{`
        :global(#go-to-body-icon) {
          scroll-margin-top: 20px;
        }
      `}</style>
    </Block>
  );
}

export default Header;

// --- Components ---

type T_MainMenuItem = {
  label: string;
  url: T_PageRoute;
  locale?: T_Locale;
};

function MainMenu(): T_ReactElement {
  const { currentLocale } = useTranslation();
  const { pathname, asPath } = useRouter();

  const [ITEMS, setItems] = React.useState<T_MainMenuItem[]>(createItems());
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  useClickOutside(menuRef, () => {
    setShowMenu(false);
  });

  React.useEffect(
    function addPrivateItems() {
      const translator = I18nService.getInstance();

      setItems([
        ...createItems(),
        ...(AuthService.isUserLoggedIn()
          ? [
              {
                label: translator.t("layout:header:menu:about_me"),
                url: ROUTES.ABOUT_ME,
                locale: undefined,
              },
              {
                label: translator.t("layout:header:common:menu_item_bookmarks"),
                url: ROUTES.BOOKMARKS,
                locale: undefined,
              },
              {
                label: translator.t("layout:header:common:menu_item_personal"),
                url: ROUTES.PERSONAL,
                locale: I18nService.getDefaultLocale(),
              },
              {
                label: translator.t("layout:header:menu:sign_out"),
                url: ROUTES.SIGN_OUT,
                locale: I18nService.getDefaultLocale(),
              },
            ]
          : isPWA()
          ? [
              {
                label: translator.t("layout:header:menu:sign_in"),
                url: ROUTES.SIGN_IN,
                locale: I18nService.getDefaultLocale(),
              },
            ]
          : []),
      ]);
    },
    [currentLocale],
  );

  function createItems(): T_MainMenuItem[] {
    const translator = I18nService.getInstance();

    return [
      {
        label: translator.t("layout:header:menu:home"),
        url: ROUTES.HOME,
        locale: undefined,
      },
      {
        label: translator.t("layout:header:common:menu_item_blog"),
        url: ROUTES.BLOG,
        locale: undefined,
      },
      {
        label: translator.t("layout:header:menu:music"),
        url: ROUTES.MUSIC,
        locale: undefined,
      },
      /*
      {
        label: translator.t("layout:header:menu:resume"),
        url: ROUTES.RESUME,
        locale: undefined,
      },
      */
    ];
  }

  return (
    <Block className="tw-relative" ref={menuRef}>
      <Button variant={Button.variant.SIMPLE} onClick={() => setShowMenu((pv) => !pv)}>
        <Icon icon={Icon.icon.CHEVRON_DOWN} size={32} />
      </Button>

      {showMenu && (
        <Block className="tw-absolute tw-top-full tw-left-0 tw-z-40 tw-w-52 tw-overflow-hidden dfr-shadow dark:dfr-shadow">
          <List className="tw-block">
            {ITEMS.map((item) => {
              const isLinkActive =
                pathname === item.url ||
                asPath === item.url ||
                (item.url !== ROUTES.HOME && pathname.startsWith(item.url));

              return (
                <List.Item
                  key={generateSlug(item.label)}
                  className=" tw-border-b dfr-bg-color-primary dfr-border-color-primary last:tw-border-0 dark:dfr-bg-color-primary dark:dfr-border-color-primary"
                  onClick={() => setShowMenu(false)}
                >
                  <Link
                    variant={Link.variant.SIMPLE}
                    href={item.url}
                    className={classNames(
                      "tw-block tw-px-2 tw-py-1 tw-text-left tw-text-base hover:tw-font-bold",
                      isLinkActive && "tw-font-bold",
                    )}
                    locale={item.locale}
                  >
                    {item.label}
                  </Link>
                </List.Item>
              );
            })}
          </List>
        </Block>
      )}
    </Block>
  );
}

const SettingsMenu = withSafeRenderingComponent(function SettingsMenu(): T_ReactElement {
  const { locale, asPath, push } = useRouter();
  const { locales: pageLocales, reloadWhenLocaleChanges } =
    useStoreSelector<T_PageConfig>(selectPageConfig);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const menuRef = React.useRef(null);
  const { showMenu, setShowMenu, toggleShowMenu } = useEnhacedState({ showMenu: false });

  const EMOJIS = { en: "🇺🇸", es: "🇪🇸" };
  const isDarkMode = theme === "dark";

  useDidMount(() => {
    if (!isDarkMode) return;
    setTheme("light");
  });

  useClickOutside(menuRef, () => {
    setShowMenu(false);
  });

  function toggleTheme() {
    setTheme(isDarkMode ? "light" : "dark");
  }

  function setLocale(locale) {
    return function setLocaleReturn() {
      setShowMenu(false);

      if (reloadWhenLocaleChanges) {
        redirect(`/${locale}${asPath}`);
        return;
      }

      push(asPath, undefined, { locale });
    };
  }

  return (
    <Block className="tw-relative" ref={menuRef}>
      <Button variant={Button.variant.SIMPLE} onClick={() => toggleShowMenu()}>
        <Icon icon={Icon.icon.COG} size={32} />
      </Button>

      {showMenu && (
        <Block className="tw-absolute tw-top-full tw-right-0 tw-z-40 tw-w-52 tw-overflow-hidden dfr-shadow dark:dfr-shadow">
          {locale && (
            <MenuItem title={t("layout:header:settings:language")}>
              {pageLocales.map((item) => {
                return (
                  <Button
                    key={item}
                    variant={Button.variant.SIMPLE}
                    className="tw-mx-1"
                    disabled={locale === item || pageLocales.length === 1}
                    onClick={setLocale(item)}
                  >
                    {EMOJIS[item]}
                  </Button>
                );
              })}
            </MenuItem>
          )}

          <MenuItem title={t("layout:header:settings:theme")}>
            <Button variant={Button.variant.SIMPLE} disabled={!isDarkMode} onClick={toggleTheme}>
              <Icon icon={Icon.icon.SUN} color="tw-text-yellow-600" size={18} />
            </Button>
            {/*
            <Space orientation="v" size={1} />
            <Button variant={Button.variant.SIMPLE} disabled={isDarkMode} onClick={toggleTheme}>
              <Icon
                icon={Icon.icon.MOON}
                color="tw-text-indigo-700 dark:tw-text-indigo-300"
                size={18}
              />
            </Button>
            */}
          </MenuItem>

          <EnvironmentMenuItem />
          <ReloadPWAMenuItem />
        </Block>
      )}
    </Block>
  );
});

const EnvironmentMenuItem = withRequiredAuthComponent(function EnvironmentMenuItem() {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  const [url, setUrl] = React.useState("/");

  useDidMount(() => {
    setUrl(
      isDevelopmentEnvironment()
        ? `${WEBSITE_METADATA.url}${window.location.pathname}`
        : `http://localhost:3000${window.location.pathname}`,
    );
  });

  return (
    <MenuItem title={`Open in "${isDevelopmentEnvironment() ? "prod" : "dev"}"`}>
      <Link variant={Link.variant.SIMPLE} href={url} isExternalUrl>
        <Icon icon={Icon.icon.EXTERNAL_LINK} />
      </Link>
    </MenuItem>
  );
});

const ReloadPWAMenuItem = withRequiredAuthComponent(function ReloadPWAMenuItem() {
  const [render, setRender] = React.useState(false);

  useDidMount(() => {
    setRender(isPWA());
  });

  if (!render) return null;

  return (
    <MenuItem title="PWA">
      <Button
        variant={Button.variant.SIMPLE}
        onClick={() => {
          window.location.reload();
        }}
      >
        <Icon icon={Icon.icon.REFRESH} />
      </Button>
    </MenuItem>
  );
});

function MenuItem({
  children,
  title,
}: {
  children: T_ReactChildrenProp;
  title: string;
}): T_ReactElement {
  return (
    <Block
      className="tw-flex tw-h-16 tw-flex-col tw-border-b tw-px-2 dfr-bg-color-primary dfr-border-color-primary last:tw-border-0 dark:dfr-bg-color-primary dark:dfr-border-color-primary"
      align="CENTER"
    >
      <Text className="tw-text-right tw-text-xs tw-font-bold">{title}</Text>
      <Block className="tw-mt-2 tw-text-right tw-leading-none">{children}</Block>
    </Block>
  );
}

function Room(): T_ReactElement {
  return (
    <Block className="dfr-Room tw-mx-auto tw-w-44 tw-max-w-full tw-border-b tw-px-1 dfr-border-color-dark-strong dark:dfr-border-color-primary">
      <PictureFrame />
      <Block className="tw-flex tw-items-end tw-justify-between">
        <TV />
        <Flowers />
      </Block>
      <Table />
    </Block>
  );
}

function PictureFrame() {
  const { t } = useTranslation();
  const [photo, setPhoto] = React.useState<{ src: string; portrait: boolean }>();

  useDidMount(() => {
    const PHOTOS = [
      {
        src: "/static/images/header/2.jpg",
        portrait: false,
      },
    ];

    setPhoto(PHOTOS[0]);
  });

  if (!photo) return null;

  return (
    <Block
      className={classNames(
        "dfr-PictureFrame tw-relative tw-mx-auto tw-mb-8 tw-rotate-2 tw-transition-transform hover:tw-rotate-0",

        photo.portrait === true ? "dfr-PictureFrame--portrait tw-w-20" : "tw-w-32",
      )}
    >
      <Block
        className={classNames(
          "tw-border-2 tw-border-yellow-700 tw-bg-yellow-900 tw-p-1",
          photo.portrait === true ? "tw-h-24" : "tw-h-20",
        )}
      >
        <Image
          src={photo.src}
          className="tw-block tw-h-full tw-w-full tw-overflow-hidden tw-rounded-md tw-border-2 tw-border-yellow-700 dfr-transition-opacity"
          alt="Photography taken by Diego Rayo"
        />
      </Block>
      <Text className="tw-mx-auto tw-h-4 tw-w-16 tw-rounded-bl-md tw-rounded-br-md tw-border-2 tw-border-t-0 tw-border-yellow-700 tw-text-center tw-text-xxs tw-font-bold tw-italic dfr-text-color-dark-strong dark:dfr-text-color-light-strong">
        {t("layout:header:room:welcome")}
      </Text>

      <style jsx>{`
        :global(.dfr-PictureFrame)::before,
        :global(.dfr-PictureFrame)::after {
          @apply dfr-bg-color-dark-strong;
          content: " ";
          display: block;
          height: 50px;
          position: absolute;
          top: -40px;
          width: 2.5px;
          z-index: -1;
        }

        :global(.tw-dark) :global(.dfr-PictureFrame)::before,
        :global(.tw-dark) :global(.dfr-PictureFrame)::after {
          @apply dfr-bg-color-light-strong;
        }

        :global(.dfr-PictureFrame)::before {
          transform: rotate(45deg);
          left: 46px;
        }

        :global(.dfr-PictureFrame)::after {
          transform: rotate(-45deg);
          right: 46px;
        }

        :global(.dfr-PictureFrame--portrait)::before,
        :global(.dfr-PictureFrame--portrait)::after {
          height: 24px;
          top: -17px;
        }

        :global(.dfr-PictureFrame--portrait)::before {
          transform: rotate(-40deg);
        }

        :global(.dfr-PictureFrame--portrait)::after {
          transform: rotate(40deg);
        }
      `}</style>
    </Block>
  );
}

function TV() {
  const [showInfo, setShowInfo] = React.useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const LS_KEY = "DFR_TV";

  useDidMount(() => {
    setShowInfo(window.localStorage.getItem(LS_KEY) === "true");
  });

  React.useEffect(
    function updateConfigOnLocalStorage() {
      window.localStorage.setItem(LS_KEY, String(showInfo));

      if (showInfo === false) {
        setIsAudioPlaying(false);

        const audioElement = document.getElementById("TV-audio") as HTMLAudioElement;
        audioElement.pause();
      }
    },
    [showInfo],
  );

  const SONG = {
    title: "La Edad Del Cielo - Cover",
    artist: "arthur victor",
    duration: "3:27",
    thumbnail: "https://i.scdn.co/image/ab67616d0000b27385cdb6b0ede4824b449dc73f",
    audio:
      "https://p.scdn.co/mp3-preview/b6fb5cddcf7285f80bfe113a38f414ee3eef28bc?cid=a46f5c5745a14fbf826186da8da5ecc3",
    url: "https://open.spotify.com/track/4jFFRZOej9hhZ6K6SKrFuU",
    source: "spotify",
  };

  return (
    <Block className="dfr-TV tw-relative tw-mb-2 tw-flex tw-w-28 tw-max-w-full tw-items-stretch tw-bg-gradient-to-b tw-from-gray-800 tw-to-black tw-p-2 dark:tw-from-white dark:tw-to-gray-300">
      <Block className="tw-relative tw-h-16 tw-w-16 tw-overflow-hidden">
        <Block
          className="tw-relative tw-h-full tw-border tw-border-opacity-80 tw-bg-cover dfr-border-color-dark-strong dark:tw-border-opacity-10"
          title={`${SONG.title} - ${SONG.artist}`}
          display="tw-flex"
          align="CENTER"
          style={{ backgroundImage: `url(${SONG.thumbnail})` }}
        >
          <Button
            variant={Button.variant.SIMPLE}
            onClick={() => {
              const audioElement = document.getElementById("TV-audio") as HTMLAudioElement;
              setIsAudioPlaying(audioElement.paused ? true : false);

              if (audioElement.paused) {
                audioElement.play();
                audioElement.volume = 0.5;
              } else {
                audioElement.pause();
              }
            }}
          >
            <Icon
              icon={isAudioPlaying ? Icon.icon.PAUSE : Icon.icon.PLAY}
              size={28}
              wrapperClassName="dfr-bg-color-dark-strong tw-bg-opacity-70 tw-rounded-full"
              iconClassName="dfr-text-color-light-strong"
            />
            <audio id="TV-audio" className="tw-hidden" onEnded={() => setShowInfo(false)}>
              <source src={SONG.audio} type="audio/mpeg" />
            </audio>
          </Button>

          <Icon
            icon={SONG.source === "youtube" ? Icon.icon.YOUTUBE : Icon.icon.SPOTIFY}
            size={12}
            wrapperClassName="tw-absolute tw-top-0.5 tw-right-0.5"
          />
        </Block>

        <Block
          className={classNames(
            "tw-absolute tw-top-0 tw-left-0 tw-h-full tw-w-full tw-transition-transform dfr-bg-color-dark-strong",
            showInfo && "tw-translate-x-full",
          )}
        />
      </Block>
      <Space size={1} orientation="v" />

      <Block className="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-justify-between tw-py-1">
        <Block className="tw-w-full tw-text-center">
          {createArray(8).map((i) => {
            return (
              <Block
                key={`Volume-${i}`}
                className="tw-my-0.5 tw-rounded-sm tw-border-b tw-border-gray-600 dark:dfr-border-color-dark-strong"
              />
            );
          })}
        </Block>
        <Button
          className={classNames(
            "tw-h-6 tw-w-6 tw-overflow-hidden tw-rounded-full tw-bg-gray-700 tw-transition-transform dark:dfr-bg-color-dark-strong",
            showInfo && "tw-rotate-90",
          )}
          onClick={() => {
            setShowInfo((currentValue) => !currentValue);

            const audioElement = document.getElementById("TV-audio") as HTMLAudioElement;
            audioElement.currentTime = 0;
          }}
        >
          <Block
            className={classNames(
              "tw-relative tw--top-2 tw-mx-auto tw-h-4 tw-w-0.5",
              showInfo ? "tw-bg-red-500" : "tw-bg-green-500",
            )}
          />
        </Button>
      </Block>

      <style jsx>{`
        :global(.dfr-TV)::before,
        :global(.dfr-TV)::after {
          @apply dfr-bg-color-dark-strong;
          @apply tw-w-2;
          @apply tw-h-6;
          content: " ";
          display: block;
          position: absolute;
          top: 90%;
          z-index: -1;
        }

        :global(.tw-dark) :global(.dfr-TV)::before,
        :global(.tw-dark) :global(.dfr-TV)::after {
          @apply tw-bg-gray-300;
        }

        :global(.dfr-TV)::before {
          transform: rotate(45deg);
          left: 15%;
        }

        :global(.dfr-TV)::after {
          transform: rotate(-45deg);
          right: 15%;
        }
      `}</style>
    </Block>
  );
}

function Flowers() {
  return (
    <Block className="tw-relative tw-overflow-hidden">
      <Icon
        icon={Icon.icon.FLOWER_2}
        size={20}
        wrapperClassName="tw-absolute tw-top-7 tw-left-2 tw--rotate-12"
      />
      <Icon icon={Icon.icon.FLOWER_3} size={48} wrapperClassName="tw-relative tw-top-0.5" />
      <Icon
        icon={Icon.icon.FLOWER_1}
        size={20}
        wrapperClassName="tw-absolute tw-top-7 tw-right-2 tw-rotate-12"
      />
    </Block>
  );
}

function Table() {
  return (
    <Block className="dark:tw-border-yellow-70 tw-flex tw-h-20 tw-items-end tw-justify-end tw-overflow-hidden tw-rounded-tr-md tw-rounded-tl-md tw-border-8 tw-border-b-0 tw-border-yellow-900">
      <Icon icon={Icon.icon.SOCCER} size={24} wrapperClassName="tw-relative tw-top-0.5 tw-left-7" />
      <Icon
        icon={Icon.icon.GUITAR}
        size={44}
        wrapperClassName="tw-relative tw--rotate-45 tw-left-2"
      />
    </Block>
  );
}
