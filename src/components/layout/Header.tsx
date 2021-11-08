import React from "react";
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
import { protectedComponent, safeRender } from "~/hocs";
import { useClickOutside, useDidMount } from "~/hooks";
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
import { ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";
import { isDevelopmentEnvironment } from "~/utils/misc";

function Header(): T_ReactElement {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  return (
    <Block is="header" className="tw-h-auto tw-py-8 sm:tw-h-screen">
      <Block className="tw-flex tw-justify-between tw-items-center">
        <MainMenu />
        <Link
          variant={Link.variant.SECONDARY}
          href={ROUTES.HOME}
          className="dfr-border-strong tw-text-sm tw-border-b-2 tw-border-dotted dark:dfr-border-strong"
        >
          {WEBSITE_METADATA.username}
        </Link>
        <SettingsMenu />
      </Block>
      <Space size={8} />

      <PictureFrame />
      <Space size={10} />

      <Button
        variant={Button.variant.SIMPLE}
        className="tw-mx-auto tw-block"
        onClick={() => {
          scrollToElement(document.getElementById("body"));
        }}
      >
        <Icon icon={Icon.icon.CHEVRON_DOUBLE_DOWN} size={32} />
      </Button>
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
                  className=" dfr-bg-secondary dark:dfr-bg-secondary dfr-border-primary dark:dfr-border-primary tw-border-b last:tw-border-0"
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

const SettingsMenu = safeRender(function SettingsMenu(): T_ReactElement {
  const { locale, asPath, push } = useRouter();
  const { locales: pageLocales, reloadWhenLocaleChanges } =
    useStoreSelector<T_PageConfig>(selectPageConfig);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const menuRef = React.useRef(null);
  const [showMenu, setShowMenu] = React.useState(false);

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
      <Button variant={Button.variant.SIMPLE} onClick={() => setShowMenu((pv) => !pv)}>
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
            <Button
              variant={Button.variant.SIMPLE}
              className="tw-mx-1"
              disabled={!isDarkMode}
              onClick={toggleTheme}
            >
              <Icon icon={Icon.icon.SUN} color="tw-text-yellow-400" size={18} />
            </Button>
            <Button
              variant={Button.variant.SIMPLE}
              className="tw-mx-1"
              disabled={isDarkMode}
              onClick={toggleTheme}
            >
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

const EnvironmentMenuItem = protectedComponent(function EnvironmentMenuItem() {
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
    <MenuItem title="Environment">
      <Link variant={Link.variant.SIMPLE} href={url} external>
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
    <Block className="dfr-bg-secondary dfr-border-primary dark:dfr-border-primary dark:dfr-bg-secondary tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-16 tw-px-2 tw-border-b last:tw-border-0">
      <Text className="tw-font-bold tw-text-xs tw-text-right">{title}</Text>
      <Block className="tw-text-right tw-leading-none tw-mt-2">{children}</Block>
    </Block>
  );
}

function PictureFrame(): T_ReactElement {
  const [photo, setPhoto] =
    React.useState<{ src: string; place: string; placeUrl: string; portrait: boolean }>();

  useDidMount(() => {
    const PHOTOS = [
      {
        src: "/static/images/header/1.png",
        place: "Palmas de cera",
        placeUrl: "https://goo.gl/maps/SEQSFq3wovNxYya46",
        portrait: true,
      },
      {
        src: "/static/images/header/2.jpg",
        place: "Bosque",
        placeUrl: "https://g.page/valle-del-cocora-salento",
        portrait: true,
      },
      {
        src: "/static/images/header/3.jpg",
        place: "Jeep",
        placeUrl: "https://goo.gl/maps/SEQSFq3wovNxYya46",
        portrait: false,
      },
      {
        src: "/static/images/header/4.jpg",
        place: "Finca cafetera",
        placeUrl: "https://g.page/finca-buenos-aires-coffee-tour",
        portrait: false,
      },
      {
        src: "/static/images/header/5.jpg",
        place: "Rústico",
        placeUrl: "https://goo.gl/maps/SEQSFq3wovNxYya46",
        portrait: false,
      },
      {
        src: "/static/images/header/6.jpg",
        place: "Filandia, Quindío",
        placeUrl: "https://g.page/tuktukrestaurante",
        portrait: false,
      },
      {
        src: "/static/images/header/7.jpg",
        place: "Hongos",
        placeUrl: "https://goo.gl/maps/P19v4BqqgEgdy3tf7",
        portrait: true,
      },
    ];
    setPhoto(PHOTOS[new Date().getDay()]);
  });

  return (
    <Block className="dfr-PictureFrame tw-w-48 tw-mx-auto">
      <Block className="dfr-bg-strong dfr-text-strong-inverted tw-text-center">
        <Icon
          icon={Icon.icon.CAMERA}
          size={20}
          color="dfr-text-strong-inverted"
          wrapperClassName="tw-relative tw-top-1.5"
        />
      </Block>
      <Block className="image-container dfr-border-strong dfr-bg-strong tw-border-4 tw-h-64 tw-flex tw-items-center">
        {photo && (
          <Link
            variant={Link.variant.SIMPLE}
            href={photo.src}
            className={classNames("tw-block", photo.portrait && "tw-h-full")}
            external
          >
            <Image
              src={photo.src}
              alt={photo.place}
              className={classNames("tw-block", photo.portrait && "tw-h-full")}
            />
          </Link>
        )}
      </Block>
      <Block className="tw-flex tw-flex-nowrap tw-items-end tw-justify-end tw-relative tw-py-1">
        <InlineText className="dfr-bg-strong tw-absolute tw-left-0 tw-top-0 tw-w-10 tw-h-2 tw-rounded-br-md tw-rounded-bl-md" />
        {photo && (
          <Link
            variant={Link.variant.SIMPLE}
            href={photo.placeUrl}
            className="dfr-text-secondary dark:dfr-text-secondary tw-text-xs tw-italic tw-pl-1 tw-font-bold"
          >
            {photo.place}
          </Link>
        )}
      </Block>

      <style jsx>{`
        :global(.dfr-PictureFrame) :global(.image-container) {
          background-image: url("/static/images/textures/1.png");
        }
      `}</style>
    </Block>
  );
}
