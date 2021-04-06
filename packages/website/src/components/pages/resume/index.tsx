import React from "react";

import { Link, Collapsible, Title } from "~/components/primitive";

type TypeResumeTimelineProps = {
  title: string;
  timeline: Array<{
    company: string;
    date: string;
    description: string;
    url?: string;
  }>;
};

export function ResumeTimeline({ title, timeline }: TypeResumeTimelineProps): any {
  return (
    <div data-block>
      <Title is="h2">{title}</Title>
      <div className="tw-border-l-4 tw-border-black dark:dfr-border-color-primary tw-pl-6 tw-ml-3 tw-mt-3">
        {timeline.map((item, index) => {
          return <TimelineItem key={`TimelineItem-${index}`} {...item} />;
        })}
      </div>
    </div>
  );
}

function TimelineItem({ company, date, description, url }: Record<string, any>): JSX.Element {
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
      <span className="tw-block tw-text-sm tw-italic tw-mt-1">{date}</span>
      <p className="tw-mt-3">{description}</p>

      <style jsx>
        {`
          .root :global(h3) {
            @apply tw-mb-0;
          }
        `}
      </style>
    </div>
  );
}

export function ResumeFAQ({ children }: Record<string, any>): any {
  return (
    <div data-block>
      <Title is="h2">FAQ</Title>
      <div>{children}</div>
    </div>
  );
}

type TypeResumeFAQItemProps = {
  question: string;
  children: string | any;
};

export function ResumeFAQItem({ question, children }: TypeResumeFAQItemProps): any {
  return (
    <Collapsible title={question}>
      <blockquote>{children}</blockquote>
    </Collapsible>
  );
}
