import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import { getSiteTexts } from "~/i18n";
import twcss from "~/lib/twcss";
import { Routes } from "~/utils/constants";

import { Link, TextWithEmoji, Separator } from "./";

// shared

export * from "./pages/resume";
export * from "./pages/my-favorite-music-and-mdx";
export { Link, TextWithEmoji, Separator };

export function Code({ language, fileName, code, sourceURL }: Record<string, any>): any {
  const SiteTexts = getSiteTexts({ page: Routes.BLOG() });

  return (
    <section className="root tw-mb-6">
      {fileName ||
        (sourceURL && (
          <code className="tw-text-sm tw-mb-2 tw-font-bold">
            {`// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`}
          </code>
        ))}
      <Highlight {...defaultProps} code={code} language={language} theme={dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre className={className} style={style}>
              {tokens.map((line, i) => {
                return (
                  <Line key={i} {...getLineProps({ line, key: i })}>
                    <LineNo>{i + 1}</LineNo>
                    <LineContent>
                      {line.map((token, key) => {
                        return <span key={key} {...getTokenProps({ token, key })} />;
                      })}
                    </LineContent>
                  </Line>
                );
              })}
            </pre>
          );
        }}
      </Highlight>
      <section className="tw-text-right">
        {sourceURL && (
          <Link className="tw-block sm:tw-inline-block sm:tw-mr-4" href={sourceURL}>
            <img
              src="/static/images/icons/github.svg"
              alt="Github icon"
              className="tw-h-3 tw-w-3 tw-inline-block tw-align-middle tw-mr-1"
            />
            <span className="tw-inline-block tw-text-sm">
              {SiteTexts.page.see_source_code}
            </span>
          </Link>
        )}
        <Link
          data-clipboard-text={code}
          className="clipboard tw-block sm:tw-inline-block tw-text-sm  tw-mt-1 sm:tw-mt-0 tw-no-underline"
          role="button"
        >
          {SiteTexts.page.copy_to_clipboard}
        </Link>
      </section>

      <style jsx>{`
        .root pre,
        .root img {
          @apply tw-my-0;
        }
      `}</style>
    </section>
  );
}

const Line = twcss.div`tw-table-row`;
const LineNo = twcss.span`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none`;
const LineContent = twcss.span`tw-table-cell`;

export function GithubRepo({ name, url, description }: Record<string, any>): any {
  return (
    <section className="root tw-mb-8">
      <Link
        className="tw-flex sm:tw-inline-flex tw-p-4 tw-bg-gray-100 tw-rounded-md tw-items-center tw-border tw-border-gray-200 tw-relative tw-pr-8"
        href={url}
      >
        <img
          src="/static/images/icons/github.svg"
          alt="Github icon"
          className="tw-h-8 tw-w-8 tw-mr-3"
        />
        <section className="tw-flex-1">
          <h3>diegofrayo/{name}</h3>
          <p className="tw-text-sm tw-text-gray-700">{description}</p>
        </section>

        <span className="tw-absolute tw-top-1 tw-right-1">🔗</span>
      </Link>

      <style jsx>{`
        .root :global(a) {
          @apply tw-no-underline;
        }

        .root img,
        .root h3,
        .root p {
          @apply tw-my-0;
        }

        .root h3 {
          @apply tw-text-base;

          @screen sm {
            @apply tw-text-lg;
          }
        }
      `}</style>
    </section>
  );
}