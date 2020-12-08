import * as React from "react";

import { Link } from "./";

function ResumeTimeline({ timeline }: Record<string, any>): any {
  return (
    <article className="tw-border-l-4 tw-border-black tw-pl-6 tw-ml-3">
      {timeline.map((item, index) => {
        return <TimelineItem key={`TimelineItem-${index}`} {...item} />;
      })}
    </article>
  );
}

// --- Components ---

function TimelineItem({ company, date, description, url }: Record<string, any>): any {
  return (
    <section className="root tw-relative tw-mb-8 last:tw-mb-0">
      <span className="tw-absolute tw--top-0.5 tw--left-10 tw-border-4 tw-border-black tw-w-8 tw-h-8 tw-rounded-full tw-bg-white" />
      {url ? (
        <Link className="tw-text-2xl" href={url}>
          {company}
        </Link>
      ) : (
        <h2 className="tw-underline">{company}</h2>
      )}
      <span className="tw-block tw-text-sm tw-italic">{date}</span>
      <p className="tw-mt-3">{description}</p>

      <style jsx>
        {`
          .root :global(h2) {
            @apply tw-mb-0;
          }
        `}
      </style>
    </section>
  );
}

export default ResumeTimeline;
