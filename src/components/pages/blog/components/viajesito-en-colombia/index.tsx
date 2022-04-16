// https://swiperjs.com/react

import "swiper/css";
import "swiper/css/pagination";

import * as React from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { Block, Image, Text } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

export function VEC_TimelineItem({
  data,
}: {
  data: { text: string; assets: { id: string; src: string; caption: string }[] };
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
  const pagination = {
    clickable: true,
  };

  return (
    <div className="root tw-rounded-md dfr-bg-color-primary">
      <Swiper
        pagination={pagination}
        modules={[Pagination]}
      >
        {data.assets.map((asset) => {
          return (
            <SwiperSlide key={asset.id}>
              <Photo {...asset} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx>{`
        .root :global(.swiper-pagination-bullets) {
          bottom: 5px;
        }

        .root :global(.swiper-pagination-bullet) {
          height: 12px;
          margin-inline: 6px;
          width: 12px;
        }
      `}</style>
    </div>
  );
}

function Photo({ src, caption }) {
  return (
    <div className="root tw-px-4 tw-pt-4 tw-pb-12">
      <Block className="container-img tw-flex tw-items-center dfr-shadow dfr-bg-color-dark-strong">
        <Image
          src={src}
          className="tw-mx-auto tw-max-h-full"
          alt={caption}
        />
      </Block>

      <Text className="tw-mt-2 tw-text-center tw-text-sm tw-italic dfr-text-color-dark-strong">{`"${caption}"`}</Text>

      <style jsx>{`
        .root :global(.container-img) {
          height: 213px;
        }
      `}</style>
    </div>
  );
}
