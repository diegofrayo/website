import * as React from "react";
import classNames from "classnames";

import { Block, Title } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

function Timeline({ timeline, TimelineItem }: T_TimelineProps): T_ReactElement {
  function getOrientation(startLeft, index) {
    const CLASS_1 = "sm:tw-ml-1 sm:tw-border-l-0 sm:tw-border-r-4 sm:tw-text-right";
    const CLASS_2 = "sm:tw-left-2/4";

    if (startLeft) return index % 2 === 0 ? CLASS_1 : CLASS_2;

    return index % 2 === 0 ? CLASS_2 : CLASS_1;
  }

  return (
    <Block>
      {timeline.map((item, index1) => {
        return (
          <Block
            is="section"
            key={item.title}
          >
            <Title
              is="h2"
              className="tw-my-8 tw-text-left tw-underline sm:tw-text-center"
              variant={Title.variant.SECONDARY}
              size={Title.size.LG}
            >
              {item.title}
            </Title>

            {item.items.map((item, index) => {
              return (
                <Block
                  key={item.id}
                  className={classNames(
                    "tw-relative tw-border-l-4 tw-border-black tw-px-4 tw-pb-8 last:tw-pb-0 dark:tw-border-white sm:tw-w-1/2",
                    getOrientation(index1 % 2 === 0, index),
                  )}
                >
                  <TimelineItem data={item} />
                </Block>
              );
            })}
          </Block>
        );
      })}
    </Block>
  );
}

export default Timeline;

// --- Types ---

type T_TimelineProps = {
  timeline: {
    title: string;
    items: any[];
  }[];
  TimelineItem: any;
};
