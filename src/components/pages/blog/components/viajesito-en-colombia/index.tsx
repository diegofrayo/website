// https://swiperjs.com/react

import "swiper/css";

import * as React from "react";
import classNames from "classnames";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import { Block, Button, Icon, Image, Text } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

export function VEC_TimelineItem({
  data,
}: {
  data: {
    text: string;
    assets: { id: string; src: string; caption: string; type: "image" | "youtube" }[];
  };
}): T_ReactElement {
  return (
    <Block>
      <Text className="tw-mb-4">{data.text}</Text>
      <Gallery data={data} />
    </Block>
  );
}

// --- Components ---

function Gallery({ data }) {
  const [activeIndex, setActiveIndex] = React.useState(1);

  return (
    <Block className="tw-rounded-md dfr-bg-color-primary">
      <Swiper
        onSlideChange={function onSlideChange() {
          setActiveIndex(this.activeIndex + 1);
        }}
      >
        {data.assets.map((asset) => {
          return (
            <SwiperSlide key={asset.id}>
              <SlideContent {...asset} />
            </SwiperSlide>
          );
        })}

        <Navigation
          activeIndex={activeIndex}
          totalElements={data.assets.length}
        />
      </Swiper>
    </Block>
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

  return (
    <Block className="tw-flex tw-items-center tw-justify-between tw-bg-opacity-10 tw-px-4 tw-pb-2 tw-pt-2 dfr-bg-color-dark-strong">
      <Button
        variant={Button.variant.SIMPLE}
        className={classNames(swiper.isBeginning && "tw-invisible")}
        onClick={() => {
          swiper.slidePrev();
        }}
      >
        <Icon icon={Icon.icon.CHEVRON_LEFT} />
      </Button>
      <Text className="tw-font-boxld tw-flex-1 tw-px-2 tw-text-center tw-text-xs dfr-text-color-dark-strong">
        {activeIndex}/{totalElements}
      </Text>
      <Button
        variant={Button.variant.SIMPLE}
        className={classNames((swiper.isEnd || totalElements === 1) && "tw-invisible")}
        onClick={() => {
          swiper.slideNext();
        }}
      >
        <Icon icon={Icon.icon.CHEVRON_RIGHT} />
      </Button>
    </Block>
  );
}

function SlideContent({ src, caption, type }) {
  return (
    <div className="root tw-px-4 tw-py-4">
      <Block className="media-container tw-flex tw-items-center dfr-shadow dfr-bg-color-dark-strong">
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
            className="tw-mx-auto tw-max-h-full"
            alt={caption}
          />
        )}
      </Block>
      <Text className="tw-mt-2 tw-px-4 tw-text-center tw-text-sm tw-italic dfr-text-color-dark-strong">{`"${caption}"`}</Text>

      <style jsx>{`
        .root :global(.media-container) {
          height: 213px;
        }
      `}</style>
    </div>
  );
}
