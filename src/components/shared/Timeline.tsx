import * as React from "react";
import classNames from "classnames";

import { Block, Title } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

function Timeline({ timeline, TimelineItem }: T_TimelineProps): T_ReactElement {
  function getOrientation({ startFromLeft, itemIndex }) {
    const CLASSNAME_1 = "sm:tw-ml-1 sm:tw-border-r-4 sm:tw-text-right";
    const CLASSNAME_2 = "sm:tw-left-2/4 sm:tw-border-l-4 sm:tw-text-left";

    if (startFromLeft) {
      return itemIndex % 2 === 0 ? CLASSNAME_1 : CLASSNAME_2;
    }

    return itemIndex % 2 === 0 ? CLASSNAME_2 : CLASSNAME_1;
  }

  return (
    <Block>
      {timeline.map((group, groupIndex) => {
        const groupTitle = group.title;

        return (
          <Block
            key={groupTitle}
            is="section"
          >
            <Title
              is="h2"
              className="tw-my-8 tw-text-center tw-underline"
              variant={Title.variant.SECONDARY}
              size={Title.size.LG}
            >
              {groupTitle}
            </Title>

            {group.items.map((item, itemIndex) => {
              return (
                <Block
                  key={`${generateSlug(groupTitle)}-${itemIndex}`}
                  className={classNames(
                    "tw-relative tw-px-0 tw-pb-6 tw-text-center last:tw-pb-0 dark:tw-border-white sm:tw-w-1/2 sm:tw-px-4 sm:tw-pb-16 sm:dfr-border-color-dark-strong",
                    getOrientation({
                      startFromLeft: groupIndex % 2 === 0,
                      itemIndex,
                    }),
                  )}
                >
                  {itemIndex === 0 && (
                    <Block className="tw-mx-auto tw-mb-6 tw-block tw-h-24 tw-w-1 dfr-bg-color-dark-strong sm:tw-hidden" />
                  )}
                  <TimelineItem data={item} />
                  {groupIndex !== timeline.length - 1 && (
                    <Block className="tw-mx-auto tw-mt-8 tw-block tw-h-24 tw-w-1 dfr-bg-color-dark-strong sm:tw-hidden" />
                  )}
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
