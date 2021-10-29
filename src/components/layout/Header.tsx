import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Icon, Button, Link, Space } from "~/components/primitive";
import { AuthService } from "~/auth";
import { safeRender } from "~/hocs";
import { useClickOutside } from "~/hooks";
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

function Header(): T_ReactElement {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  return (
    <header className="tw-h-auto tw-py-8 tw-text-center sm:tw-h-screen">
      <div className="tw-flex tw-justify-between tw-items-center">
        <Menu />
        <Link
          variant={Link.variant.SIMPLE}
          href={ROUTES.HOME}
          className="dfr-text-strong dfr-border-strong dark:dfr-text-strong dark:dfr-border-strong tw-font-bold tw-text-sm tw-border-b-2 tw-border-dotted"
          isNextLink
        >
          {WEBSITE_METADATA.username}
        </Link>
        <SettingsMenu />
      </div>
      <Space size={8} />

      <PictureFrame />
      <Space size={10} />

      <Button
        onClick={() => {
          scrollToElement(document.getElementById("body"));
        }}
      >
        <Icon icon={Icon.icon.CHEVRON_DOUBLE_DOWN} size={32} />
      </Button>
    </header>
  );
}

export default Header;

// --- Components ---

type T_MenuItem = {
  label: string;
  url: T_PageRoute;
  locale?: T_Locale;
};

function Menu(): T_ReactElement {
  const { currentLocale } = useTranslation();
  const { asPath } = useRouter();

  const [ITEMS, setItems] = useState<T_MenuItem[]>(createItems());
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => {
    setShowMenu(false);
  });

  useEffect(
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

  function createItems(): T_MenuItem[] {
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
    <div className="tw-relative" ref={menuRef}>
      <Button onClick={() => setShowMenu((pv) => !pv)}>
        <Icon icon={Icon.icon.CHEVRON_DOWN} size={32} />
      </Button>

      {showMenu && (
        <div className="dfr-shadow dark:dfr-shadow tw-absolute tw-top-full tw-z-40 tw-w-52 tw-overflow-hidden tw-left-0">
          <ul className="tw-block">
            {ITEMS.map((item) => {
              const isLinkActive =
                asPath === item.url || (item.url !== ROUTES.HOME && asPath.startsWith(item.url));

              return (
                <li
                  key={generateSlug(item.label)}
                  className=" dfr-bg-secondary dark:dfr-bg-secondary dfr-border-primary dark:dfr-border-primary tw-border-b last:tw-border-0"
                  onClick={() => setShowMenu(false)}
                >
                  <Link
                    href={item.url}
                    variant={Link.variant.SIMPLE}
                    className={classNames(
                      "tw-block tw-text-left tw-text-base tw-px-2 tw-py-1 hover:tw-font-bold",
                      isLinkActive && "tw-font-bold",
                    )}
                    locale={item.locale}
                    isNextLink
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const SettingsMenu = safeRender(function SettingsMenu(): T_ReactElement {
  const { locale, asPath, push } = useRouter();
  const { locales: pageLocales, reloadWhenLocaleChanges } =
    useStoreSelector<T_PageConfig>(selectPageConfig);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

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
    <div className="tw-relative" ref={menuRef}>
      <Button onClick={() => setShowMenu((pv) => !pv)}>
        <Icon icon={Icon.icon.COG} size={32} />
      </Button>

      {showMenu && (
        <div className="dfr-shadow dark:dfr-shadow tw-absolute tw-top-full tw-z-40 tw-w-52 tw-overflow-hidden tw-right-0">
          {locale && (
            <MenuItem title={t("layout:header:settings:language")}>
              {pageLocales.map((item) => {
                return (
                  <Button
                    key={item}
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
            <Button className="tw-mx-1" disabled={!isDarkMode} onClick={toggleTheme}>
              <Icon icon={Icon.icon.SUN} color="tw-text-yellow-400" size={18} />
            </Button>
            <Button className="tw-mx-1" disabled={isDarkMode} onClick={toggleTheme}>
              <Icon
                icon={Icon.icon.MOON}
                color="tw-text-indigo-700 dark:tw-text-indigo-300"
                size={18}
              />
            </Button>
          </MenuItem>
        </div>
      )}
    </div>
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
    <div className="dfr-bg-secondary dfr-border-primary dark:dfr-border-primary dark:dfr-bg-secondary tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-16 tw-px-2 tw-border-b last:tw-border-0">
      <p className="tw-font-bold tw-text-xs tw-text-right">{title}</p>
      <div className="tw-text-right tw-leading-none tw-mt-2">{children}</div>
    </div>
  );
}

function PictureFrame(): T_ReactElement {
  const { t } = useTranslation();

  const PHOTOS = [
    {
      src: "/static/images/header/1.png",
      place: "El alto, Pijao",
      placeUrl: "https://goo.gl/maps/SEQSFq3wovNxYya46",
      portrait: true,
    },
    {
      src: "/static/images/header/2.jpg",
      place: "Valle de Cocora",
      placeUrl: "https://g.page/valle-del-cocora-salento?share",
      portrait: true,
    },
    {
      src: "/static/images/header/3.jpg",
      place: "Pijao, Quindío",
      placeUrl: "https://goo.gl/maps/SEQSFq3wovNxYya46",
      portrait: false,
    },
  ];

  const PHOTO = PHOTOS[new Date().getDate() % 3 === 0 ? 0 : new Date().getDate() % 2 === 0 ? 1 : 2];

  return (
    <div className="tw-w-48 tw-mx-auto">
      <div className="dfr-bg-strong dfr-text-strong-inverted tw-text-center tw-px-1 tw-text-sm tw-font-bold tw-pt-1">
        {t("layout:header:frame:title")}
      </div>
      <div className="image-container dfr-border-strong dfr-bg-strong tw-border-4 tw-h-64 tw-flex tw-items-center">
        <img
          src={PHOTO.src}
          className={classNames("dfr-transition-opacity", PHOTO.portrait && "tw-h-full")}
          alt={PHOTO.place}
        />
      </div>
      <div className="tw-flex tw-flex-nowrap tw-items-end tw-justify-end tw-relative tw-py-1">
        <span className="dfr-bg-strong tw-absolute tw-left-0 tw-top-0 tw-w-10 tw-h-2 tw-rounded-br-md tw-rounded-bl-md" />
        <Link
          variant={Link.variant.SIMPLE}
          href={PHOTO.placeUrl}
          className="dfr-text-secondary dark:dfr-text-secondary tw-text-xs tw-italic tw-pl-1 tw-font-bold"
        >
          {PHOTO.place}
        </Link>
      </div>

      <style jsx>{`
        .image-container {
          background-image: url("/static/images/textures/1.png");
        }
      `}</style>
    </div>
  );
}
