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
import { isDevelopmentEnvironment } from "~/utils/misc";
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

      <PictureFrame />
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

function PictureFrame(): T_ReactElement {
  const [photo, setPhoto] = React.useState<{ src: string; portrait: boolean }>();

  useDidMount(() => {
    const PHOTOS = [
      {
        src: "/static/images/header/1.png",
        portrait: true,
      },
      {
        src: "/static/images/header/2.jpg",
        portrait: true,
      },
      {
        src: "/static/images/header/3.jpg",
        portrait: false,
      },
      {
        src: "/static/images/header/4.jpg",
        portrait: false,
      },
      {
        src: "/static/images/header/5.jpg",
        portrait: false,
      },
      {
        src: "/static/images/header/6.jpg",
        portrait: false,
      },
      {
        src: "/static/images/header/7.jpg",
        portrait: true,
      },
    ];

    setPhoto(PHOTOS[new Date().getDay()]);
  });

  if (!photo) return null;

  return (
    <Block className="dfr-PictureFrame tw-mx-auto tw-w-40 tw-max-w-full">
      <Block className="tw-flex tw-items-end tw-justify-between tw-overflow-hidden">
        <Icon icon={Icon.icon.FLOWER_3} size={32} wrapperClassName="tw-relative tw-top-1" />
        <Icon icon={Icon.icon.FLOWER_2} size={24} wrapperClassName="tw-relative tw-top-1" />

        <Block
          className={classNames(
            "tw-mx-1 tw-flex-shrink-0",
            photo.portrait === true ? "tw-w-12" : "tw-w-16",
          )}
        >
          <Link
            variant={Link.variant.UNSTYLED}
            href={photo.src}
            className={classNames(
              "dfr-border-color-strong light:vd:dfr-bg-color-strong tw-block tw-border-2 tw-p-1 dark:dfr-border-color-strong dark:vl:dfr-bg-color-strong",
              photo.portrait === true ? "tw-h-16" : "tw-h-12",
            )}
            isExternalUrl
          >
            <Image
              src={photo.src}
              className="dfr-transition-opacity dfr-border-color-strong tw-border-opacity-70 tw-border tw-h-full tw-w-full tw-rounded-sm dark:dfr-border-color-strong"
              alt="Photography taken by Diego Rayo"
            />
          </Link>
          <Block className="dfr-bg-color-strong tw-block tw-w-2 tw-h-0.5 tw-mx-auto dark:dfr-bg-color-strong" />
        </Block>

        <Icon icon={Icon.icon.FLOWER_1} size={24} wrapperClassName="tw-relative tw-top-1" />
        <Icon icon={Icon.icon.FLOWER_3} size={32} wrapperClassName="tw-relative tw-top-1" />
      </Block>

      <Block className="tw-border-4 tw-border-b-0 tw-border-yellow-800 tw-h-16 tw-rounded-tr-md tw-rounded-tl-md dark:tw-border-yellow-500 tw-relative">
        <Icon
          icon={Icon.icon.SOCCER}
          size={32}
          wrapperClassName="tw-absolute tw--bottom-0.5 tw--right-0.5"
        />
      </Block>
    </Block>
  );
}
