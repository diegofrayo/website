import React from "react";

import { Link, Collapsible } from "~/components/primitive";

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
      <h2>{title}</h2>
      <div className="tw-border-l-4 tw-border-black dark:dfr-border-color-primary tw-pl-6 tw-ml-3">
        {timeline.map((item, index) => {
          return <TimelineItem key={`TimelineItem-${index}`} {...item} />;
        })}
      </div>
    </div>
  );
}

function TimelineItem({ company, date, description, url }: Record<string, any>): any {
  return (
    <div className="root tw-relative tw-mb-8 last:tw-mb-0">
      <span className="tw-absolute tw--left-10 tw-border-4 tw-border-black dark:dfr-border-color-primary tw-w-7 tw-h-7 tw-rounded-full tw-bg-white" />
      {url ? (
        <Link
          className="tw-text-xl tw-text-black dark:tw-text-white tw-font-bold tw-underline"
          href={url}
          styled={false}
        >
          {company}
        </Link>
      ) : (
        <h3 className="dark:dfr-text-color-primary">{company}</h3>
      )}
      <span className="tw-block tw-text-sm tw-italic">{date}</span>
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
      <h2>FAQ</h2>
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
