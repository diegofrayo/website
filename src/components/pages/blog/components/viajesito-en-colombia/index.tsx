import "swiper/css";

import * as React from "react";
import classNames from "classnames";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import { Block, Button, Icon, Image, Modal, Text } from "~/components/primitive";
import { useDidMount, useEnhancedState } from "~/hooks";
import type { T_ReactElement, T_ReactElementNullable, T_ReactSetState } from "~/types";

const Context = React.createContext({} as T_Context);

type T_VEC_TimelineItemProps = {
  data: {
    text: string;
    assets: T_ImageItem[];
  };
};

export function VEC_TimelineItem({ data }: T_VEC_TimelineItemProps): T_ReactElement {
  // states & refs
  const [isModalVisible, setIsModalVisible, toggleIsModalVisible] = useEnhancedState(false);
  const [sharedIndex, setSharedIndex] = React.useState(0);

  // handlers
  function handleCloseModalClick(): void {
    setIsModalVisible(false);
  }

  return (
    <Block>
      <Text className="tw-mb-4 tw-text-base">{data.text}</Text>
      <Gallery
        variant="DEFAULT"
        data={data}
        toggleIsModalVisible={toggleIsModalVisible}
        setSharedIndex={setSharedIndex}
      />
      <Modal
        visible={isModalVisible}
        onCloseHandler={handleCloseModalClick}
      >
        <Block className="tw-relative tw-m-4 tw-mx-auto tw-h-full tw-w-full tw-overflow-auto dfr-max-w-layout dfr-bg-color-dark-strong">
          <Button
            variant={Button.variant.SIMPLE}
            className="tw-absolute tw-top-2 tw-right-2 tw-z-10"
            onClick={handleCloseModalClick}
          >
            <Icon
              icon={Icon.icon.X}
              color="dfr-text-color-light-strong"
              size={32}
            />
          </Button>
          <Gallery
            data={data}
            variant="FULLSCREEN"
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

type T_GalleryProps = {
  variant: "DEFAULT" | "FULLSCREEN";
  data: T_VEC_TimelineItemProps["data"];
  toggleIsModalVisible: () => void;
  setSharedIndex: T_ReactSetState<number>;
  initialSlide?: number;
};

function Gallery({
  variant,
  data,
  toggleIsModalVisible,
  setSharedIndex,
  initialSlide = 0,
}: T_GalleryProps): T_ReactElement {
  // states & refs
  const [activeIndex, setActiveIndex] = React.useState(1);

  // vars
  const isFullscreenVariant = variant === "FULLSCREEN";
  const contextValueMemoized = React.useMemo(() => {
    return {
      activeIndex,
      setActiveIndex,
      isFullscreenVariant,
      setSharedIndex,
      toggleIsModalVisible,
    };
  }, [activeIndex, setActiveIndex, isFullscreenVariant, setSharedIndex, toggleIsModalVisible]);

  // handlers
  function onSlideChangeHandler(): void {
    /*
     * I use `this` here because of the library docs is not enough clear
     * about how to get the activeIndex and I don't want to spend time with this,
     * it is not too important
     */
    // @ts-ignore
    // eslint-disable-next-line react/no-this-in-sfc
    setActiveIndex(this.activeIndex + 1);
  }

  // render
  return (
    <Context.Provider value={contextValueMemoized}>
      <div
        className={classNames(
          "root tw-relative tw-h-full",
          isFullscreenVariant ? "dfr-bg-color-dark-strong" : "tw-rounded-md dfr-bg-color-primary",
        )}
      >
        <Swiper
          initialSlide={initialSlide}
          onSlideChange={onSlideChangeHandler}
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
        `}</style>

        <style jsx>{`
          .root :global(.swiper-wrapper) {
            align-items: ${isFullscreenVariant ? "center" : "flex-start"};
          }
        `}</style>
      </div>
    </Context.Provider>
  );
}

type T_NavigationProps = {
  activeIndex: number;
  totalElements: number;
};

function Navigation({ activeIndex, totalElements }: T_NavigationProps): T_ReactElement {
  // hooks
  const swiper = useSwiper();

  // context
  const { isFullscreenVariant } = React.useContext(Context);

  // handlers
  function handlePrevItemClick(): void {
    swiper.slidePrev();
  }

  function handleNextItemClick(): void {
    swiper.slideNext();
  }

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
        onClick={handlePrevItemClick}
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
        onClick={handleNextItemClick}
      >
        <Icon
          icon={Icon.icon.CHEVRON_RIGHT}
          color={isFullscreenVariant ? "dfr-text-color-light-strong" : "dfr-text-color-dark-strong"}
        />
      </Button>
    </Block>
  );
}

type T_SlideContentProps = Omit<T_ImageItem, "id"> & { index: number };

function SlideContent({
  src,
  caption,
  type,
  isLandscape,
  index,
}: T_SlideContentProps): T_ReactElementNullable {
  // states & refs
  const [photosHeight, setPhotosHeight] = React.useState(0);

  // context
  const { isFullscreenVariant, toggleIsModalVisible, setSharedIndex } = React.useContext(Context);

  // effects
  useDidMount(() => {
    const REST_OF_ELEMENTS_HEIGHT = 40 + 80 + 24 * 2 + 16 * 2 + (32 + 24 + 8);
    setPhotosHeight(window.innerHeight - REST_OF_ELEMENTS_HEIGHT);
  });

  // handlers
  function handleImageClick(): void {
    if (isFullscreenVariant) return;

    toggleIsModalVisible();
    setSharedIndex(index);
  }

  // render
  if (photosHeight === 0) {
    return null;
  }

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
            onClick={handleImageClick}
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

        .root :global(.media-container--fullscreen) {
          height: auto;
        }
      `}</style>

      <style jsx>{`
        .root :global(.media-container--fullscreen) > :global(img) {
          max-height: ${photosHeight}px;
        }

        .root :global(.media-container--fullscreen) > :global(iframe) {
          height: ${photosHeight}px;
        }
      `}</style>
    </div>
  );
}

// --- Types ---

type T_Context = {
  activeIndex: number;
  setActiveIndex: T_ReactSetState<number>;
  isFullscreenVariant: boolean;
  toggleIsModalVisible: () => void;
  setSharedIndex: T_ReactSetState<number>;
};

type T_ImageItem = {
  id: string;
  src: string;
  caption: string;
  isLandscape: boolean;
  type: "image" | "youtube";
};
