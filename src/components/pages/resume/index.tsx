import * as React from "react";

import { Link, Collapsible, Title, Block, Text, InlineText } from "~/components/primitive";
import { T_ReactChildrenProp, T_ReactElement } from "~/types";

type T_ResumeTimelineItem = {
  company: string;
  date: string;
  description: string;
  url?: string;
};

type T_ResumeTimelineProps = {
  title: string;
  timeline: T_ResumeTimelineItem[];
};

export function ResumeTimeline({ title, timeline }: T_ResumeTimelineProps): T_ReactElement {
  return (
    <Block
      is="section"
      data-markdown-block
    >
      <Title is="h2">{title}</Title>
      <Block className="tw-ml-3 tw-mt-3 tw-border-l-4 tw-border-black tw-pl-6 dark:dfr-border-color-primary">
        {timeline.map((item, index) => {
          return (
            <TimelineItem
              key={`TimelineItem-${index}`}
              {...item}
            />
          );
        })}
      </Block>
    </Block>
  );
}

function TimelineItem({
  company,
  date,
  description,
  url = "",
}: T_ResumeTimelineItem): T_ReactElement {
  return (
    <Block
      is="section"
      className="tw-relative tw-mb-8 last:tw-mb-0"
    >
      <InlineText className="tw-absolute tw--left-10 tw-top-0.5 tw-h-7 tw-w-7 tw-rounded-full tw-border-4 tw-border-black tw-bg-white dark:dfr-border-color-primary" />

      <Title
        is="h3"
        variant={Title.variant.SECONDARY}
        size={Title.size.MD}
      >
        {url ? (
          <Link
            className="tw-underline"
            href={url}
            variant={Link.variant.SIMPLE}
            isExternalUrl
          >
            {company}
          </Link>
        ) : (
          company
        )}
      </Title>
      <InlineText className="tw-mt-0.5 tw-mb-3 tw-block tw-text-sm tw-italic">{date}</InlineText>
      <Text>{description}</Text>
    </Block>
  );
}

export function ResumeFAQ({ children }: { children: T_ReactChildrenProp }): T_ReactElement {
  return (
    <Block
      is="section"
      data-markdown-block
    >
      <Title is="h2">FAQ</Title>
      <Block>{children}</Block>
    </Block>
  );
}

type T_ResumeFAQItemProps = {
  question: string;
  children: T_ReactChildrenProp;
};

ResumeFAQ.Item = function ResumeFAQItem({
  question,
  children,
}: T_ResumeFAQItemProps): T_ReactElement {
  return (
    <Collapsible title={question}>
      <blockquote>{children}</blockquote>
    </Collapsible>
  );
};
