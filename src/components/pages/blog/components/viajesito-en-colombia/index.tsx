import "swiper/css";

import * as React from "react";
import classNames from "classnames";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import { Block, Button, Icon, Image, Modal, Text } from "~/components/primitive";
import { useDidMount, useEnhancedState } from "~/hooks";
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
  const [isModalVisible, setIsModalVisible, toggleIsModalVisible] = useEnhancedState(false);

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
        <Block className="tw-relative tw-m-4 tw-mx-auto tw-h-full tw-w-full tw-overflow-auto dfr-max-w-layout dfr-bg-color-dark-strong">
          <Button
            variant={Button.variant.SIMPLE}
            className="tw-absolute tw-top-2 tw-right-2 tw-z-10"
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
          "root tw-relative tw-h-full",
          isFullscreenVariant ? "dfr-bg-color-dark-strong" : "tw-rounded-md dfr-bg-color-primary",
        )}
      >
        <Swiper
          initialSlide={initialSlide}
          onSlideChange={function onSlideChange() {
            setActiveIndex(this.activeIndex + 1);
          }}
        >
          {data.assets.map((asset, index) => (
            <SwiperSlide key={asset.id}>
              <SlideContent
                {...asset}
                index={index}
              />
            </SwiperSlide>
          ))}
          <Navigation
            activeIndex={activeIndex}
            totalElements={data.assets.length}
          />
        </Swiper>

        <style jsx>
          {`
            .root :global(.swiper) {
              display: flex;
              flex-direction: column;
              height: 100%;
              justify-content: space-between;
            }

            .root :global(.swiper-wrapper) {
              display: flex;
              height: auto;
              margin: auto;
            }
          `}
        </style>

        <style jsx>
          {`
            .root :global(.swiper-wrapper) {
              align-items: ${isFullscreenVariant ? "center" : "flex-start"};
            }
          `}
        </style>
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
        "tw-flex tw-w-full tw-items-center tw-justify-between tw-bg-opacity-10 tw-px-4 tw-py-2",
        isFullscreenVariant
          ? "tw-absolute tw-bottom-0 tw-z-10 dfr-bg-color-light-strong dfr-text-color-light-strong"
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
  const [photosHeight, setPhotosHeight] = React.useState(0);

  useDidMount(() => {
    const REST_OF_ELEMENTS_HEIGHT = 40 + 80 + 24 * 2 + 16 * 2 + (32 + 24 + 8);
    setPhotosHeight(window.innerHeight - REST_OF_ELEMENTS_HEIGHT);
  });

  if (photosHeight === 0) return null;

  return (
    <div
      className={classNames(
        "root",
        isFullscreenVariant ? "tw-flex tw-h-full tw-flex-col tw-justify-center" : "tw-p-4",
      )}
    >
      <Block
        className={classNames(
          "media-container dfr-shadow dfr-bg-color-dark-strong",
          isFullscreenVariant
            ? isLandscape
              ? "media-container--fullscreen"
              : "media-container--fullscreen media-container--fullscreen--portrait"
            : "tw-flex tw-items-center",
        )}
      >
        {type === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${src}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="tw-mx-auto tw-h-full tw-w-full"
            frameBorder="0"
            loading="lazy"
            title="Embedded youtube"
            allowFullScreen
          />
        ) : (
          <Image
            src={src}
            className={classNames(
              "tw-mx-auto tw-max-h-full tw-max-w-full",
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

      <style jsx>
        {`
          .root :global(.media-container) {
            height: 213px;
          }

          .root :global(.media-container--fullscreen) {
            height: auto;
          }
        `}
      </style>

      <style jsx>
        {`
          .root :global(.media-container--fullscreen) > :global(img) {
            max-height: ${photosHeight}px;
          }

          .root :global(.media-container--fullscreen) > :global(iframe) {
            height: ${photosHeight}px;
          }
        `}
      </style>
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
