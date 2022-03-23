import * as React from "react";
import { useTheme } from "next-themes";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Block, Button, Icon, Link, List, Text, Space } from "~/components/primitive";
import { AuthService } from "~/auth";
import { withRequiredAuthComponent } from "~/hocs";
import { useClickOutside, useDidMount, useEnhacedState } from "~/hooks";
import { I18nService, useTranslation } from "~/i18n";
import http from "~/lib/http";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import type {
  T_Locale,
  T_PageRoute,
  T_ReactChildrenProp,
  T_ReactElement,
  T_WebsiteMetadata,
} from "~/types";
import { isPWA } from "~/utils/browser";
import { isDevelopmentEnvironment } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";

function Header(): T_ReactElement {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);

  return (
    <Block
      is="header"
      className="tw-relative tw-py-8"
    >
      <Block className="tw-text-center">
        <Link
          variant={Link.variant.SECONDARY}
          href={ROUTES.HOME}
          className="tw-border-b-2 tw-border-dotted dfr-border-color-dark-strong dark:dfr-border-color-light-strong"
        >
          {WEBSITE_METADATA.username}
        </Link>
        <Block className="tw-mt-2">
          <MainMenu />
        </Block>
      </Block>

      <Block className="tw-absolute tw-top-7 tw-right-0">
        <SettingsMenu />
      </Block>
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
                label: translator.t("layout:header:common:menu_item_personal"),
                url: ROUTES.PERSONAL,
              },
              {
                label: translator.t("layout:header:common:menu_item_bookmarks"),
                url: ROUTES.BOOKMARKS,
              },
              {
                label: translator.t("layout:header:menu:sign_out"),
                url: ROUTES.SIGN_OUT,
              },
            ]
          : isPWA()
          ? [
              {
                label: translator.t("layout:header:menu:sign_in"),
                url: ROUTES.SIGN_IN,
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
      },
      {
        label: translator.t("layout:header:menu:about_me"),
        url: ROUTES.ABOUT_ME,
      },
      {
        label: translator.t("layout:header:menu:resume"),
        url: ROUTES.RESUME,
      },
      {
        label: translator.t("layout:header:common:menu_item_blog"),
        url: ROUTES.BLOG,
      },
      {
        label: translator.t("layout:header:menu:music"),
        url: ROUTES.MUSIC,
      },
    ];
  }

  return (
    <Block
      className="tw-relative tw-inline-block"
      ref={menuRef}
    >
      <Button
        variant={Button.variant.SIMPLE}
        onClick={() => setShowMenu((pv) => !pv)}
      >
        <Icon
          icon={Icon.icon.CHEVRON_DOWN}
          size={32}
        />
      </Button>

      {showMenu && (
        <Block
          className="tw-absolute tw-top-full tw-z-40 tw-w-40 tw-overflow-hidden dfr-shadow dark:dfr-shadow"
          style={{ left: -65 }}
        >
          <List className="tw-block">
            {ITEMS.map((item) => {
              const isLinkActive =
                pathname === item.url ||
                asPath === item.url ||
                (item.url !== ROUTES.HOME && pathname.startsWith(item.url));

              return (
                <List.Item
                  key={generateSlug(item.label)}
                  className=" tw-border-b tw-border-gray-800 dfr-bg-color-dark-strong last:tw-border-0 dark:dfr-bg-color-primary dark:dfr-border-color-primary"
                  onClick={() => setShowMenu(false)}
                >
                  <Link
                    variant={Link.variant.SIMPLE}
                    href={item.url}
                    className={classNames(
                      "tw-block tw-px-2 tw-py-1 tw-text-center tw-text-base tw-text-gray-400 hover:tw-font-bold",
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

const SettingsMenu = withRequiredAuthComponent(function SettingsMenu(): T_ReactElement {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const menuRef = React.useRef(null);
  const { showMenu, setShowMenu, toggleShowMenu } = useEnhacedState({ showMenu: false });

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

  return (
    <Block
      className="tw-relative"
      ref={menuRef}
    >
      <Button
        variant={Button.variant.SIMPLE}
        onClick={() => toggleShowMenu()}
      >
        <Icon
          icon={Icon.icon.COG}
          size={32}
        />
      </Button>

      {showMenu && (
        <Block className="tw-absolute tw-top-full tw-right-0 tw-z-40 tw-mt-2 tw-w-44 tw-overflow-hidden dfr-shadow dark:dfr-shadow">
          <MenuItem
            title={t("layout:header:settings:theme")}
            className="tw-hidden"
          >
            <Button
              variant={Button.variant.SIMPLE}
              disabled={!isDarkMode}
              onClick={toggleTheme}
            >
              <Icon
                icon={Icon.icon.SUN}
                color="tw-text-yellow-600"
                size={18}
              />
            </Button>
            <Space
              orientation="v"
              size={1}
            />
            <Button
              variant={Button.variant.SIMPLE}
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

          <ISRMenuItem />
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
      <Link
        variant={Link.variant.SIMPLE}
        href={url}
        isExternalUrl
      >
        <Icon icon={Icon.icon.EXTERNAL_LINK} />
      </Link>
    </MenuItem>
  );
});

const ISRMenuItem = withRequiredAuthComponent(function ISRMenuItem() {
  return (
    <MenuItem title="ISR on-demand">
      <Button
        variant={Button.variant.SIMPLE}
        onClick={async () => {
          try {
            await http.post("/api/diegofrayo", {
              path: window.location.pathname,
              secret: process.env.NEXT_PUBLIC_ISR_TOKEN,
            });
            window.location.reload();
          } catch (error) {
            console.error(error);
            alert("Error:" + error.message);
          }
        }}
      >
        <Icon icon={Icon.icon.SERVER} />
      </Button>
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
  className = "",
}: {
  children: T_ReactChildrenProp;
  title: string;
  className?: string;
}): T_ReactElement {
  return (
    <Block
      className={classNames(
        "tw-flex tw-h-16 tw-flex-col tw-border-b tw-px-2 dfr-bg-color-primary dfr-border-color-primary last:tw-border-0 dark:dfr-bg-color-primary dark:dfr-border-color-primary",
        className,
      )}
      align="CENTER"
    >
      <Text className="tw-text-right tw-text-xs tw-font-bold">{title}</Text>
      <Block className="tw-mt-2 tw-text-right tw-leading-none">{children}</Block>
    </Block>
  );
}
