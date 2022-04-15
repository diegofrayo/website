import * as React from "react";
import classNames from "classnames";

import { Block, Title } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

function Timeline({ timeline, TimelineItem }: T_TimelineProps): T_ReactElement {
  function getOrientation({ startFromLeft, itemIndex }) {
    const CLASSNAME_1 = "sm:tw-ml-1 sm:tw-border-l-0 sm:tw-border-r-4 sm:tw-text-right";
    const CLASSNAME_2 = "sm:tw-left-2/4";

    if (startFromLeft) {
      return itemIndex % 2 === 0 ? CLASSNAME_1 : CLASSNAME_2;
    }

    return itemIndex % 2 === 0 ? CLASSNAME_2 : CLASSNAME_1;
  }

  return (
    <Block>
      {timeline.map((item, groupIndex) => {
        const groupTitle = item.title;

        return (
          <Block
            key={groupTitle}
            is="section"
          >
            <Title
              is="h2"
              className="tw-my-8 tw-text-left tw-underline sm:tw-text-center"
              variant={Title.variant.SECONDARY}
              size={Title.size.LG}
            >
              {groupTitle}
            </Title>

            {item.items.map((item, itemIndex) => {
              return (
                <Block
                  key={`${generateSlug(groupTitle)}-${itemIndex}`}
                  className={classNames(
                    "tw-relative tw-border-l-4 tw-border-black tw-px-4 tw-pb-8 last:tw-pb-0 dark:tw-border-white sm:tw-w-1/2",
                    getOrientation({ startFromLeft: groupIndex % 2 === 0, itemIndex }),
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
