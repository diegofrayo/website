import classNames from "classnames";
import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, InlineText, Space, Icon, Image, Text, Button } from "~/components/primitive";
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
        <Block className="tw-mx-auto tw-w-72 tw-max-w-full tw-overflow-hidden tw-rounded-md tw-border-x dfr-shadow dfr-border-color-dark-strong">
          <Text className="tw-border-y-8 tw-border-x tw-py-0.5 tw-text-center tw-text-sm tw-font-bold dfr-border-color-dark-strong">
            Diego Rayo
          </Text>
          <Room />
          <Block className="tw-flex tw-justify-between tw-border-y-8 tw-border-x dfr-border-color-dark-strong">
            <LinkItem label="about-me" url={ROUTES.ABOUT_ME} />
            <Space size={2} />
            <LinkItem label="blog" url={ROUTES.BLOG} />
            <Space size={2} />
            <LinkItem label="resume" url={ROUTES.RESUME} />
          </Block>
        </Block>
      </MainLayout>
    </Page>
  );
}

export default Home;

// --- Components ---

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
      src: "/static/images/header/1.jpg",
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
    title: "El Charro Chino",
    artist: "Indio Solari y los Fundamentalistas del Aire Acondicionado",
    duration: "4:26",
    thumbnail: "https://i.scdn.co/image/ab67616d0000b273109ce4d556bd574e0e781da6",
    audio:
      "https://p.scdn.co/mp3-preview/b843041c1ccaec2384899e4d128e22d84cdc33b5?cid=a46f5c5745a14fbf826186da8da5ecc3",
    url: "https://open.spotify.com/track/6EHebf59vOGwm4NrbbENRs",
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

function LinkItem({ label, url }) {
  return (
    <Block className="tw-mx-2 tw-inline-flex tw-py-0.5 tw-text-sm dfr-text-color-dark-strong">
      <InlineText>❴</InlineText>
      <Link variant={Link.variant.SECONDARY} className="tw-mx-0.5 tw-underline" href={url}>
        {label}
      </Link>
      <InlineText>❵</InlineText>
    </Block>
  );
}
