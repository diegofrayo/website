import React from "react";

import { Link, Collapsible, Title } from "~/components/primitive";
import { T_ReactChildrenProp, T_ReactFCReturn } from "~/types";

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

export function ResumeTimeline({ title, timeline }: T_ResumeTimelineProps): T_ReactFCReturn {
  return (
    <div data-markdown-block>
      <Title is="h2">{title}</Title>
      <div className="tw-border-l-4 tw-border-black dark:dfr-border-color-primary tw-pl-6 tw-ml-3 tw-mt-3">
        {timeline.map((item, index) => {
          return <TimelineItem key={`TimelineItem-${index}`} {...item} />;
        })}
      </div>
    </div>
  );
}

function TimelineItem({
  company,
  date,
  description,
  url = "",
}: T_ResumeTimelineItem): T_ReactFCReturn {
  return (
    <div className="root tw-relative tw-mb-8 last:tw-mb-0">
      <span className="tw-absolute tw--left-10 tw-border-4 tw-border-black dark:dfr-border-color-primary tw-w-7 tw-h-7 tw-rounded-full tw-bg-white tw-top-0.5" />

      <Title is="h3" variant={Title.variant.SECONDARY}>
        {url ? (
          <Link className="tw-underline" href={url} variant={Link.variant.UNSTYLED}>
            {company}
          </Link>
        ) : (
          company
        )}
      </Title>
      <span className="tw-block tw-text-sm tw-italic tw-mt-0.5 tw-mb-3">{date}</span>
      <p>{description}</p>
    </div>
  );
}

export function ResumeFAQ({ children }: { children: T_ReactChildrenProp }): T_ReactFCReturn {
  return (
    <div data-markdown-block>
      <Title is="h2">FAQ</Title>
      <div>{children}</div>
    </div>
  );
}

type T_ResumeFAQItemProps = {
  question: string;
  children: T_ReactChildrenProp;
};

export function ResumeFAQItem({ question, children }: T_ResumeFAQItemProps): T_ReactFCReturn {
  return (
    <Collapsible title={question}>
      <blockquote>{children}</blockquote>
    </Collapsible>
  );
}