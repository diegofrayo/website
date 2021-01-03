import React, { SetStateAction, useState } from "react";
import classnames from "classnames";

import { Link } from "../.";

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
    <section data-block>
      <h2>{title}</h2>
      <section className="tw-border-l-4 tw-border-black dark:twc-border-color-primary tw-pl-6 tw-ml-3">
        {timeline.map((item, index) => {
          return <TimelineItem key={`TimelineItem-${index}`} {...item} />;
        })}
      </section>
    </section>
  );
}

function TimelineItem({ company, date, description, url }: Record<string, any>): any {
  return (
    <section className="root tw-relative tw-mb-8 last:tw-mb-0">
      <span className="tw-absolute tw--left-10 tw-border-4 tw-border-black dark:twc-border-color-primary tw-w-7 tw-h-7 tw-rounded-full tw-bg-white" />
      {url ? (
        <Link className="tw-text-xl" href={url}>
          {company}
        </Link>
      ) : (
        <h3 className="dark:twc-text-color-primary">{company}</h3>
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
    </section>
  );
}

export function ResumeFAQ({ children }: Record<string, any>): any {
  return (
    <section data-block>
      <h2>FAQ</h2>
      <section>{children}</section>
    </section>
  );
}

type TypeResumeFAQItemProps = {
  question: string;
  children: string | any;
};

export function ResumeFAQItem({ question, children }: Record<string, any>): any {
  const [collapsed, setCollapsed]: [
    boolean,
    React.Dispatch<SetStateAction<boolean>>,
  ] = useState(true);

  return (
    <section className="root tw-mb-4">
      <section>
        <h3
          className="dark:twc-text-color-primary tw-inline-block tw-cursor-pointer"
          onClick={() => {
            setCollapsed(cv => !cv);
          }}
        >
          <span
            className={classnames(
              "tw-inline-block tw-transition-all tw-transform tw-mr-0",
              !collapsed && "tw-rotate-90",
            )}
          >
            ‣
          </span>{" "}
          {question}
        </h3>
      </section>

      <section
        className={classnames(
          "tw-pl-3",
          collapsed ? "tw-hidden tw-mb-0" : "tw-block twc-mb-base",
        )}
      >
        <blockquote>{children}</blockquote>
      </section>

      <style jsx>
        {`
          .root :global(h3) {
            @apply tw-mb-1;
          }
        `}
      </style>
    </section>
  );
}
