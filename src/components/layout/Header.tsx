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
import {
  T_Locale,
  T_PageConfig,
  T_PageRoute,
  T_ReactChildrenProp,
  T_ReactElement,
  T_WebsiteMetadata,
} from "~/types";
import { scrollToElement } from "~/utils/browser";
import { createArray, isDevelopmentEnvironment } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";

function Header(): T_ReactElement {
  const { asPath } = useRouter();
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  return (
    <Block
      is="header"
      className="tw-h-auto tw-py-8 sm:tw-h-screen sm:tw-flex sm:tw-flex-col sm:tw-justify-between"
    >
      <Block>
        <Block className="tw-flex tw-justify-between tw-items-center">
          <MainMenu />
          <Link
            variant={Link.variant.SECONDARY}
            href={ROUTES.HOME}
            className="dfr-border-color-dark-strong tw-text-sm tw-border-b-2 tw-border-dotted dark:dfr-border-color-light-strong"
          >
            {WEBSITE_METADATA.username}
          </Link>
          <SettingsMenu />
        </Block>
        <Block className="tw-text-center">
          <InlineText className="dfr-text-color-secondary tw-text-xxs dark:dfr-text-color-secondary">
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
      if (AuthService.isUserLoggedIn()) {
        const translator = I18nService.getInstance();

        setItems([
          ...createItems(),
          {
            label: translator.t("layout:header:common:menu_item_bookmarks"),
            url: ROUTES.BOOKMARKS,
            locale: undefined,
          },
          {
            label: "Timer",
            url: ROUTES.TIMER,
            locale: undefined,
          },
          {
            label: translator.t("layout:header:common:menu_item_personal"),
            url: ROUTES.PERSONAL,
            locale: I18nService.getDefaultLocale(),
          },
        ]);
      }
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
      /*
      {
        label: translator.t("layout:header:menu:about_me"),
        url: ROUTES.ABOUT_ME,
        locale: undefined,
      },
      {
        label: translator.t("layout:header:menu:resume"),
        url: ROUTES.RESUME,
        locale: undefined,
      },
      */
      {
        label: translator.t("layout:header:menu:music"),
        url: ROUTES.MUSIC,
        locale: undefined,
      },
      {
        label: translator.t("layout:header:menu:projects"),
        url: ROUTES.PROJECTS,
        locale: undefined,
      },
    ];
  }

  return (
    <Block className="tw-relative" ref={menuRef}>
      <Button variant={Button.variant.SIMPLE} onClick={() => setShowMenu((pv) => !pv)}>
        <Icon icon={Icon.icon.CHEVRON_DOWN} size={32} />
      </Button>

      {showMenu && (
        <Block className="dfr-shadow dark:dfr-shadow tw-absolute tw-top-full tw-z-40 tw-w-52 tw-overflow-hidden tw-left-0">
          <List className="tw-block">
            {ITEMS.map((item) => {
              const isLinkActive =
                pathname === item.url ||
                asPath === item.url ||
                (item.url !== ROUTES.HOME && pathname.startsWith(item.url));

              return (
                <List.Item
                  key={generateSlug(item.label)}
                  className=" dfr-bg-color-primary dark:dfr-bg-color-primary dfr-border-color-primary dark:dfr-border-color-primary tw-border-b last:tw-border-0"
                  onClick={() => setShowMenu(false)}
                >
                  <Link
                    variant={Link.variant.SIMPLE}
                    href={item.url}
                    className={classNames(
                      "tw-block tw-text-left tw-text-base tw-px-2 tw-py-1 hover:tw-font-bold",
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
        window.location.href = `/${locale}${asPath}`;
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
        <Block className="dfr-shadow dark:dfr-shadow tw-absolute tw-top-full tw-z-40 tw-w-52 tw-overflow-hidden tw-right-0">
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
              <Icon icon={Icon.icon.SUN} color="tw-text-yellow-400" size={18} />
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

function MenuItem({
  children,
  title,
}: {
  children: T_ReactChildrenProp;
  title: string;
}): T_ReactElement {
  return (
    <Block
      className="dfr-bg-color-primary dfr-border-color-primary dark:dfr-border-color-primary dark:dfr-bg-color-primary tw-flex tw-flex-col tw-h-16 tw-px-2 tw-border-b last:tw-border-0"
      align="CENTER"
    >
      <Text className="tw-font-bold tw-text-xs tw-text-right">{title}</Text>
      <Block className="tw-text-right tw-leading-none tw-mt-2">{children}</Block>
    </Block>
  );
}

function Room(): T_ReactElement {
  return (
    <Block className="dfr-Room dfr-border-color-dark-strong tw-mx-auto tw-w-44 tw-max-w-full tw-border-b tw-px-1 dark:dfr-border-color-primary">
      <PictureFrame />
      <Block className="tw-flex tw-justify-between tw-items-end">
        <TV />
        <Flowers />
      </Block>
      <Table />
    </Block>
  );
}

function PictureFrame() {
  const [photo, setPhoto] = React.useState<{ src: string; portrait: boolean }>();

  useDidMount(() => {
    const PHOTOS = [
      {
        src: "/static/images/header/3.jpg",
        portrait: true,
      },
    ];

    setPhoto(PHOTOS[0]);
  });

  if (!photo) return null;

  return (
    <Block
      className={classNames(
        "dfr-PictureFrame tw-mb-8 tw-mx-auto tw-relative tw-transition-transform tw-rotate-2 hover:tw-rotate-0",

        photo.portrait === true ? "dfr-PictureFrame--portrait tw-w-20" : "tw-w-32",
      )}
    >
      <Block
        className={classNames(
          "tw-p-1 tw-bg-yellow-900 tw-border-2 tw-border-yellow-700",
          photo.portrait === true ? "tw-h-24" : "tw-h-20",
        )}
      >
        <Image
          src={photo.src}
          className="dfr-transition-opacity tw-block tw-h-full tw-w-full tw-rounded-md tw-overflow-hidden tw-border-2 tw-border-yellow-700"
          alt="Photography taken by Diego Rayo"
        />
      </Block>
      <Text className="dfr-text-color-dark-strong tw-text-xxs tw-italic tw-font-bold tw-text-center tw-border-yellow-700 tw-border-2 tw-border-t-0 tw-w-16 tw-mx-auto tw-rounded-bl-md tw-rounded-br-md tw-h-4 dark:dfr-text-color-light-strong">
        welcome
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
    title: "Juguetes Perdidos (En Vivo)",
    artist: "Indio Solari y los Fundamentalistas del Aire Acondicionado",
    duration: "7:02",
    thumbnail: "https://i.scdn.co/image/ab67616d0000b273b951223171ecfabe6ac97335",
    source: "spotify",
    url: "https://open.spotify.com/track/1SBGb9SOYwb8H7LhK5daAS",
    audio:
      "https://p.scdn.co/mp3-preview/af49bab92a964225ea8b17829049a5d19b23e77b?cid=a46f5c5745a14fbf826186da8da5ecc3",
  };

  return (
    <Block className="dfr-TV tw-flex tw-items-stretch tw-p-2 tw-bg-gradient-to-b tw-from-gray-800 tw-to-black tw-w-28 tw-max-w-full tw-relative tw-mb-2 dark:tw-from-white dark:tw-to-gray-300">
      <Block className="tw-relative tw-h-16 tw-w-16 tw-overflow-hidden">
        <Block
          className="dfr-border-color-dark-strong tw-border tw-border-opacity-80 tw-relative tw-bg-cover tw-h-full dark:tw-border-opacity-10"
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
            <audio id="TV-audio" className="tw-hidden" onEnded={() => setIsAudioPlaying(false)}>
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
            "dfr-bg-color-dark-strong tw-h-full tw-w-full tw-transition-transform tw-absolute tw-top-0 tw-left-0",
            showInfo && "tw-translate-x-full",
          )}
        />
      </Block>
      <Space size={1} orientation="v" />

      <Block className="tw-flex tw-flex-col tw-justify-between tw-items-center tw-flex-1 tw-py-1">
        <Block className="tw-w-full tw-text-center">
          {createArray(8).map((i) => {
            return (
              <Block
                key={`Volume-${i}`}
                className="tw-border-b tw-border-gray-600 tw-my-0.5 tw-rounded-sm dark:dfr-border-color-dark-strong"
              />
            );
          })}
        </Block>
        <Button
          className={classNames(
            "tw-rounded-full tw-h-6 tw-w-6 tw-bg-gray-700 tw-overflow-hidden tw-transition-transform dark:dfr-bg-color-dark-strong",
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
              "tw-w-0.5 tw-h-4 tw-mx-auto tw-relative tw--top-2",
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
    <Block className="tw-flex tw-items-end tw-justify-end tw-border-8 tw-border-b-0 tw-border-yellow-900 tw-h-20 tw-rounded-tr-md tw-rounded-tl-md tw-overflow-hidden dark:tw-border-yellow-70">
      <Icon icon={Icon.icon.SOCCER} size={24} wrapperClassName="tw-relative tw-top-0.5 tw-left-7" />
      <Icon
        icon={Icon.icon.GUITAR}
        size={44}
        wrapperClassName="tw-relative tw--rotate-45 tw-left-2"
      />
    </Block>
  );
}
