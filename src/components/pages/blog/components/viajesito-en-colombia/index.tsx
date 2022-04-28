import "swiper/css";

import * as React from "react";
import classNames from "classnames";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import { Block, Button, Icon, Image, Modal, Text } from "~/components/primitive";
import { useEnhacedState } from "~/hooks";
import type { T_ReactElement } from "~/types";

const Context = React.createContext({} as T_Context);

export function VEC_TimelineItem({
  data,
}: {
  data: {
    text: string;
    assets: {
      id: string;
      src: string;
      caption: string;
      isLandscape: boolean;
      type: "image" | "youtube";
    }[];
  };
}): T_ReactElement {
  const [sharedIndex, setSharedIndex] = React.useState(0);
  const { isModalVisible, setIsModalVisible, toggleIsModalVisible } = useEnhacedState({
    isModalVisible: false,
  });

  return (
    <Block>
      <Text className="tw-mb-4 tw-text-base">{data.text}</Text>
      <Gallery
        variant="default"
        data={data}
        toggleIsModalVisible={toggleIsModalVisible}
        setSharedIndex={setSharedIndex}
      />
      <Modal
        visible={isModalVisible}
        onCloseHandler={setIsModalVisible}
      >
        <Block className="tw-m-4 tw-mx-auto tw-w-full tw-overflow-auto dfr-max-w-layout dfr-bg-color-dark-strong">
          <Button
            variant={Button.variant.SIMPLE}
            className="tw-mt-2 tw-mr-2 tw-mb-6 tw-ml-auto tw-block"
            onClick={() => toggleIsModalVisible()}
          >
            <Icon
              icon={Icon.icon.X}
              color="dfr-text-color-light-strong"
              size={32}
            />
          </Button>
          <Gallery
            data={data}
            variant="fullscreen"
            toggleIsModalVisible={toggleIsModalVisible}
            setSharedIndex={setSharedIndex}
            initialSlide={sharedIndex}
          />
        </Block>
      </Modal>
    </Block>
  );
}

// --- Components ---

function Gallery({ variant, data, toggleIsModalVisible, setSharedIndex, initialSlide = 0 }) {
  const [activeIndex, setActiveIndex] = React.useState(1);
  const isFullscreenVariant = variant === "fullscreen";

  return (
    <Context.Provider
      value={{
        activeIndex,
        setActiveIndex,
        isFullscreenVariant,
        setSharedIndex,
        toggleIsModalVisible,
      }}
    >
      <div
        className={classNames(
          "root",
          isFullscreenVariant ? "dfr-bg-color-dark-strong" : "tw-rounded-md dfr-bg-color-primary",
        )}
      >
        <Swiper
          initialSlide={initialSlide}
          onSlideChange={function onSlideChange() {
            setActiveIndex(this.activeIndex + 1);
          }}
        >
          {data.assets.map((asset, index) => {
            return (
              <SwiperSlide key={asset.id}>
                <SlideContent
                  {...asset}
                  index={index}
                />
              </SwiperSlide>
            );
          })}
          <Navigation
            activeIndex={activeIndex}
            totalElements={data.assets.length}
          />
        </Swiper>

        <style jsx>{`
          .root :global(.swiper-wrapper) {
            display: flex;
            align-items: center;
          }
        `}</style>
      </div>
    </Context.Provider>
  );
}

function Navigation({
  activeIndex,
  totalElements,
}: {
  activeIndex: number;
  totalElements: number;
}) {
  const swiper = useSwiper();
  const { isFullscreenVariant } = React.useContext(Context);

  return (
    <Block
      className={classNames(
        "tw-flex tw-items-center tw-justify-between tw-bg-opacity-10 tw-px-4 tw-py-2",
        isFullscreenVariant
          ? "dfr-bg-color-light-strong dfr-text-color-light-strong"
          : "dfr-bg-color-dark-strong dfr-text-color-dark-strong",
      )}
    >
      <Button
        variant={Button.variant.SIMPLE}
        className={classNames(swiper.isBeginning && "tw-invisible")}
        onClick={() => {
          swiper.slidePrev();
        }}
      >
        <Icon
          icon={Icon.icon.CHEVRON_LEFT}
          color={isFullscreenVariant ? "dfr-text-color-light-strong" : "dfr-text-color-dark-strong"}
        />
      </Button>
      <Text className="tw-flex-1 tw-px-2 tw-text-center tw-text-xs">
        {activeIndex}/{totalElements}
      </Text>
      <Button
        variant={Button.variant.SIMPLE}
        className={classNames((swiper.isEnd || totalElements === 1) && "tw-invisible")}
        onClick={() => {
          swiper.slideNext();
        }}
      >
        <Icon
          icon={Icon.icon.CHEVRON_RIGHT}
          color={isFullscreenVariant ? "dfr-text-color-light-strong" : "dfr-text-color-dark-strong"}
        />
      </Button>
    </Block>
  );
}

function SlideContent({ src, caption, type, isLandscape, index }) {
  const { isFullscreenVariant, toggleIsModalVisible, setSharedIndex } = React.useContext(Context);

  return (
    <div className={classNames("root", isFullscreenVariant ? "tw-pb-4" : "tw-p-4")}>
      <Block
        className={classNames(
          "media-container dfr-shadow dfr-bg-color-dark-strong",
          isFullscreenVariant
            ? isLandscape
              ? "media-container--large"
              : "media-container--large media-container--large--portrait"
            : "tw-flex tw-items-center",
        )}
      >
        {type === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${src}`}
            className="tw-mx-auto tw-max-h-full tw-max-w-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Embedded youtube"
            allowFullScreen
          />
        ) : (
          <Image
            src={src}
            className={classNames(
              "tw-mx-auto tw-max-h-full",
              !isFullscreenVariant && "tw-cursor-pointer",
            )}
            alt={caption}
            onClick={
              !isFullscreenVariant
                ? () => {
                    toggleIsModalVisible();
                    setSharedIndex(index);
                  }
                : undefined
            }
          />
        )}
      </Block>
      <Text
        className={classNames(
          "tw-mt-2 tw-px-4 tw-text-center tw-text-sm tw-italic",
          isFullscreenVariant ? "dfr-text-color-light-strong" : "dfr-text-color-dark-strong",
        )}
      >
        {caption}
      </Text>

      <style jsx>{`
        .root :global(.media-container) {
          height: 213px;
        }

        .root :global(.media-container--large) {
          height: auto;
        }

        .root :global(.media-container--large--portrait) > :global(*) {
          height: 426px;
        }

        @media screen(sm) {
          .root :global(.media-container--large) > :global(*) {
            height: auto;
            max-height: 426px;
          }
        }
      `}</style>
    </div>
  );
}

// --- Types ---

type T_Context = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  isFullscreenVariant: boolean;
  toggleIsModalVisible: () => void;
  setSharedIndex: React.Dispatch<React.SetStateAction<number>>;
};
