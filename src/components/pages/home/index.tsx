import classNames from "classnames";
import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import {
  Block,
  Button,
  Icon,
  Image,
  InlineText,
  Link,
  Space,
  Text,
  Title,
} from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { useDidMount } from "~/hooks";
import { useTranslation } from "~/i18n";
import type { T_ReactElement } from "~/types";
import { createArray } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";

function Home(): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.HOME,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout title="">
        <Block className="tw-mx-auto tw-w-72 tw-max-w-full">
          <Featured />
          <Space size={4} />
          <Block className="tw-overflow-hidden tw-rounded-t-md dfr-shadow">
            <Room />
            <Block className="tw-flex tw-items-center tw-justify-between tw-border-y-8 dfr-border-color-dark-strong">
              <LinkItem
                label="about me"
                url={ROUTES.ABOUT_ME}
              />
              <LinkItem
                label="blog"
                url={ROUTES.BLOG}
                className="tw-hidden sm:tw-block"
              />
              <LinkItem
                label="resume"
                url={ROUTES.RESUME}
              />
            </Block>
          </Block>
        </Block>
      </MainLayout>
    </Page>
  );
}

export default Home;

// --- Components ---

function Featured() {
  return (
    <Block
      is="section"
      className="tw-relative tw-rounded-t-md tw-border-8 tw-border-yellow-700 tw-bg-green-700 tw-p-4 dfr-shadow"
    >
      <Emoji className="tw-absolute tw--top-4 tw--left-4 tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-text-sm dfr-shadow dfr-bg-color-light-strong">
        📌
      </Emoji>
      <Title
        is="h1"
        variant={Title.variant.UNSTYLED}
        className="tw-text-center dfr-text-color-light-strong"
        size={Title.size.MD}
      >
        FEATURED
      </Title>
      <Space size={2} />
      <Link
        variant={Link.variant.SIMPLE}
        href={`${ROUTES.BLOG}/viajesito-en-colombia`}
        className="tw-block tw-rotate-1 tw-text-sm tw-text-yellow-300"
      >
        <Emoji>🖇️</Emoji>
        <InlineText className="tw-mx-1 tw-underline">Viajesito en Colombia</InlineText>
        <InlineText>[blog-post]</InlineText>
      </Link>
      <Space size={1} />
      <Link
        variant={Link.variant.SIMPLE}
        href={ROUTES.MUSIC}
        className="tw-block tw--rotate-1 tw-text-sm tw-text-yellow-300"
      >
        <Emoji>🖇️</Emoji>
        <InlineText className="tw-mx-1 tw-underline">/music</InlineText>
      </Link>
    </Block>
  );
}

function Room(): T_ReactElement {
  return (
    <Block className="dfr-Room tw-px-8 tw-pt-16 dfr-bg-color-light-strong sm:tw-px-16">
      <PictureFrame />
      <Block className="tw-flex tw-items-end tw-justify-between tw-overflow-hidden">
        <TV />
        <Flowers />
      </Block>
      <Table />

      <style jsx>{`
        :global(.dfr-Room) {
          background-image: url("/static/images/textures/arabesque.png");
        }
      `}</style>
    </Block>
  );
}

function PictureFrame() {
  const { t } = useTranslation();
  const [photo, setPhoto] = React.useState<{ src: string; portrait: boolean }>();

  useDidMount(() => {
    setPhoto({
      src: "/static/images/header/3.jpg",
      portrait: false,
    });
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
      <Text className="tw-mx-auto tw-h-4 tw-w-16 tw-rounded-bl-md tw-rounded-br-md tw-border-2 tw-border-t-0 tw-border-yellow-700 tw-text-center tw-text-xxs tw-font-bold tw-italic dfr-text-color-dark-strong dfr-bg-color-light-strong dark:dfr-text-color-light-strong">
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
  const [hasNotStartedTV, setHasNotStartedTV] = React.useState(true);

  React.useEffect(
    function updateConfigOnLocalStorage() {
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
            <audio
              id="TV-audio"
              className="tw-hidden"
              onEnded={() => setShowInfo(false)}
            >
              <source
                src={SONG.audio}
                type="audio/mpeg"
              />
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
      <Space
        size={1}
        orientation="v"
      />

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
        <Block className="tw-h-6 tw-w-6 tw-overflow-hidden tw-rounded-full tw-bg-gray-700 tw-transition-transform dark:dfr-bg-color-dark-strong">
          {hasNotStartedTV ? (
            <Button
              className="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center"
              onClick={() => {
                setHasNotStartedTV(false);
                setShowInfo(true);
              }}
            >
              <Block className="tw-relative tw-h-2 tw-w-2 tw-animate-ping tw-rounded-full tw-bg-green-500" />
            </Button>
          ) : (
            <Button
              className={classNames(
                "tw-h-full tw-w-full tw-transition-transform",
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
                  showInfo ? "tw-bg-green-500" : "tw-bg-red-500",
                )}
              />
            </Button>
          )}
        </Block>
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
          z-index: 0;
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
    <Block className="tw-relative tw-flex-shrink-0 tw-overflow-hidden">
      <Icon
        icon={Icon.icon.FLOWER_2}
        size={20}
        wrapperClassName="tw-absolute tw-top-7 tw-left-2 tw--rotate-12"
      />
      <Icon
        icon={Icon.icon.FLOWER_3}
        size={48}
        wrapperClassName="tw-relative tw-top-0.5"
      />
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
      <Icon
        icon={Icon.icon.SOCCER}
        size={24}
        wrapperClassName="tw-relative tw-top-0.5 tw-left-7"
      />
      <Icon
        icon={Icon.icon.GUITAR}
        size={44}
        wrapperClassName="tw-relative tw--rotate-45 tw-left-2"
      />
    </Block>
  );
}

function LinkItem({ label, url, className = "" }) {
  return (
    <Block
      className={classNames(
        "tw-mx-2 tw-inline-flex tw-py-0.5 tw-text-sm dfr-text-color-dark-strong",
        className,
      )}
    >
      <InlineText>❴</InlineText>
      <Link
        variant={Link.variant.SECONDARY}
        className="tw-mx-0.5 tw-underline"
        href={url}
      >
        {label}
      </Link>
      <InlineText>❵</InlineText>
    </Block>
  );
}
