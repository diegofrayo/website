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
            className="dfr-border-color-strong tw-text-sm tw-border-b-2 tw-border-dotted dark:dfr-border-color-strong"
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
          },
          {
            label: translator.t("layout:header:common:menu_item_playground"),
            url: ROUTES.PLAYGROUND,
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
      */
      {
        label: translator.t("layout:header:menu:resume"),
        url: ROUTES.RESUME,
        locale: undefined,
      },
      {
        label: translator.t("layout:header:menu:music"),
        url: ROUTES.MUSIC,
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
            <Space orientation="v" size={1} />
            <Button variant={Button.variant.SIMPLE} disabled={isDarkMode} onClick={toggleTheme}>
              <Icon
                icon={Icon.icon.MOON}
                color="tw-text-indigo-700 dark:tw-text-indigo-300"
                size={18}
              />
            </Button>
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
    <Block className="dfr-Room dfr-border-color-strong tw-mx-auto tw-w-40 tw-max-w-full tw-border-b tw-px-1 dark:dfr-border-color-strong">
      <PictureFrame />
      <TV />
      <Table />
    </Block>
  );
}

function PictureFrame() {
  const [photo, setPhoto] = React.useState<{ src: string; portrait: boolean }>();

  useDidMount(() => {
    const PHOTOS = [
      {
        src: "/static/images/header/1.jpg",
        portrait: false,
      },
    ];

    setPhoto(PHOTOS[0]);
  });

  if (!photo) return null;

  return (
    <Block
      className={classNames(
        "dfr-PictureFrame tw-mb-8 tw-mx-auto tw-relative",
        photo.portrait === true ? "tw-w-20" : "tw-w-32",
      )}
    >
      <Block className="tw-p-0.5" style={{ backgroundColor: "#AC6B3C" }}>
        <Block className="tw-p-1" style={{ backgroundColor: "#70361A" }}>
          <Link
            variant={Link.variant.UNSTYLED}
            href={photo.src}
            className={classNames(
              "tw-block tw-border-2 tw-rounded-md tw-overflow-hidden",
              photo.portrait === true ? "tw-h-24" : "tw-h-20",
            )}
            style={{ borderColor: "#AC6B3C" }}
            isExternalUrl
          >
            <Image
              src={photo.src}
              className="tw-h-full tw-w-full"
              alt="Photography taken by Diego Rayo"
            />
          </Link>
        </Block>
      </Block>

      <style jsx>{`
        :global(.dfr-PictureFrame)::before,
        :global(.dfr-PictureFrame)::after {
          @apply dfr-bg-color-strong;
          @apply tw-transform;
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
          @apply dark:v:dfr-bg-color-strong;
        }

        :global(.dfr-PictureFrame)::before {
          @apply tw-rotate-45;
          left: 46px;
        }

        :global(.dfr-PictureFrame)::after {
          @apply tw--rotate-45;
          right: 46px;
        }
      `}</style>
    </Block>
  );
}

function TV() {
  const [showInfo, setShowInfo] = React.useState(false);
  const LS_KEY = "DFR_TV";

  useDidMount(() => {
    setShowInfo(window.localStorage.getItem(LS_KEY) === "true");
  });

  React.useEffect(
    function updateConfigOnLocalStorage() {
      window.localStorage.setItem(LS_KEY, String(showInfo));
    },
    [showInfo],
  );

  const SONG = {
    title: "Un Pacto",
    artist: "Cóndor Sbarbati",
    duration: "4:30",
    thumbnail: "http://i3.ytimg.com/vi/WNebXvrqGDE/maxresdefault.jpg",
    source: "youtube",
    url: "https://youtu.be/WNebXvrqGDE",
  };

  return (
    <Block className="dfr-TV tw-flex tw-items-stretch tw-p-2 tw-bg-gradient-to-b tw-from-gray-800 tw-to-black tw-w-28 tw-max-w-full tw-mx-auto tw-relative tw-mb-2 dark:tw-from-white dark:tw-to-gray-300">
      {showInfo ? (
        <Block className="tw-relative tw-rounded-md tw-overflow-hidden">
          <Image src={SONG.thumbnail} className="tw-h-16 tw-w-16 tw-block tw-object-cover" />
          <Text
            className="dfr-bg-color-strong tw-font-bold tw-truncate tw-absolute tw-w-full tw-px-1 tw-left-0 tw-text-center tw-pt-0.5 tw-h-4 tw-text-xxs light:vd:dfr-text-color-strong tw-top-0"
            title={SONG.title}
          >
            {SONG.title}
          </Text>
          <Text
            className="dfr-bg-color-strong tw-font-bold tw-truncate tw-absolute tw-w-full tw-px-1 tw-left-0 tw-text-center tw-pt-0.5 tw-h-4 tw-text-xxs dfr-text-color-secondary tw-bottom-0"
            title={SONG.artist}
          >
            {SONG.artist}
          </Text>
        </Block>
      ) : (
        <Block className="dfr-bg-color-strong tw-h-16 tw-w-16 tw-block tw-rounded-md" />
      )}
      <Space size={1} orientation="v" />

      <Block className="tw-flex tw-flex-col tw-justify-between tw-items-center tw-flex-1 tw-pt-1">
        <Block className="tw-w-full tw-text-center">
          {createArray(5).map((i) => {
            return (
              <Block
                key={`Volume-${i}`}
                className="tw-border-b tw-border-gray-600 tw-my-0.5 tw-rounded-sm"
              />
            );
          })}
          <Button
            className={classNames(
              "tw-rounded-full tw-h-4 tw-w-4 tw-bg-gray-700 tw-overflow-hidden tw-transform tw-transition-transform dark:vl:dfr-bg-color-strong",
              showInfo && "tw-rotate-90",
            )}
            onClick={() => setShowInfo((currentValue) => !currentValue)}
          >
            <Block
              className={classNames(
                "tw-w-0.5 tw-h-2 tw-mx-auto tw-relative tw--top-1",
                showInfo ? "tw-bg-red-500" : "tw-bg-green-500",
              )}
            />
          </Button>
        </Block>

        <Link
          variant={Link.variant.SIMPLE}
          href={SONG.url}
          className={classNames(
            "tw-block tw-justify-self-end tw-leading-0",
            showInfo ? "tw-visible" : "tw-invisible",
          )}
          isExternalUrl
        >
          <Icon
            icon={SONG.source === "youtube" ? Icon.icon.YOUTUBE : Icon.icon.SPOTIFY}
            size={12}
          />
        </Link>
      </Block>

      <style jsx>{`
        :global(.dfr-TV)::before,
        :global(.dfr-TV)::after {
          @apply dfr-bg-color-strong;
          @apply tw-w-1;
          @apply tw-h-4;
          @apply tw-transform;
          content: " ";
          display: block;
          position: absolute;
          top: 95%;
          z-index: -1;
        }

        :global(.tw-dark) :global(.dfr-TV)::before,
        :global(.tw-dark) :global(.dfr-TV)::after {
          @apply tw-bg-gray-300;
        }

        :global(.dfr-TV)::before {
          @apply tw-rotate-45;
          left: 15%;
        }

        :global(.dfr-TV)::after {
          @apply tw--rotate-45;
          right: 15%;
        }
      `}</style>
    </Block>
  );
}

function Table() {
  return (
    <Block className="tw-flex tw-items-end tw-justify-between tw-border-4 tw-border-b-0 tw-border-yellow-800 tw-h-16 tw-rounded-tr-md tw-rounded-tl-md tw-overflow-hidden dark:tw-border-yellow-500">
      <Block>
        <Icon
          icon={Icon.icon.FLOWER_1}
          size={16}
          wrapperClassName="tw-relative tw-transform tw-top-3 tw-left-5 tw--rotate-12"
        />
        <Icon icon={Icon.icon.FLOWER_3} size={40} wrapperClassName="tw-relative tw-top-0.5" />
        <Icon
          icon={Icon.icon.FLOWER_2}
          size={20}
          wrapperClassName="tw-relative tw-transform tw-top-3 tw-right-5 tw-rotate-12"
        />
      </Block>
      <Icon icon={Icon.icon.SOCCER} size={20} wrapperClassName="tw-relative tw-top-0.5 tw-left-5" />
      <Icon
        icon={Icon.icon.GUITAR}
        size={36}
        wrapperClassName="tw-relative tw-top tw-transform tw--rotate-45 tw-left-2"
      />
    </Block>
  );
}
