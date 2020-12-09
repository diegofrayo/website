import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import { getSiteTexts } from "~/i18n";
import twcss from "~/lib/twcss";
import { Routes } from "~/utils/constants";
import { copyToClipboard } from "~/utils/misc";

import { Link } from "./";

// shared

export * from "./pages/resume";
export * from "./pages/my-favorite-music-and-mdx";

export function Code({ language, fileName, code, sourceURL }: Record<string, any>): any {
  const SiteTexts = getSiteTexts({ page: Routes.BLOG() });

  return (
    <section className="root tw-mb-6">
      <section className="code-header tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-2 tw-rounded-t-md">
        {fileName ||
          (sourceURL && (
            <code className="tw-text-sm tw-font-bold">
              {`// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`}
            </code>
          ))}

        <span className="tw-rounded-md tw-bg-yellow-300 tw-text-yellow-700 tw-text-xs tw-px-3 tw-py-1 tw-inline-block tw-font-bold tw-flex-shrink-0 tw-ml-4 tw-font-mono">
          {language}
        </span>
      </section>

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
          <Link
            className="tw-block sm:tw-inline-block tw-ml-auto tw-mt-1 sm:tw-mt-0 sm:tw-mr-4"
            href={sourceURL}
          >
            <img
              src="/static/images/icons/github.svg"
              alt="Github icon"
              className="tw-h-4 tw-w-4 tw-inline-block tw-align-middle tw-mr-1"
            />
            <span className="tw-inline-block tw-text-sm">
              {SiteTexts.page.see_source_code}
            </span>
          </Link>
        )}
        <button
          className="clipboard tw-block sm:tw-inline-block tw-ml-auto tw-mt-1 sm:tw-mt-0 tw-text-sm tw-text-blue-700 tw-font-bold tw-text-right"
          data-clipboard-text={code}
          onClick={copyToClipboard}
        >
          {SiteTexts.page.copy_to_clipboard}
        </button>
      </section>

      <style jsx>{`
        .root pre,
        .root img {
          @apply tw-my-0;
        }

        .root pre {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }

        .code-header {
          border: 1px solid #272b35;
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
    <section className="root tw-mb-6 tw-text-right">
      <Link
        className="tw-flex sm:tw-inline-flex tw-p-4 tw-bg-gray-100 tw-rounded-md tw-items-center tw-border tw-border-gray-200 tw-relative tw-pr-8"
        href={url}
      >
        <img
          src="/static/images/icons/github.svg"
          alt="Github icon"
          className="tw-h-8 tw-w-8 tw-mr-3"
        />
        <section className="tw-flex-1 tw-text-left">
          <h3>diegofrayo/{name}</h3>
          <p className="tw-text-sm tw-text-gray-700">{description}</p>
        </section>

        <img
          src="/static/images/icons/link.svg"
          alt="Link icon"
          className="tw-absolute tw-top-2 tw-right-2 tw-h-4 tw-w-4"
        />
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
