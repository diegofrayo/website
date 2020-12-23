import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import twcss from "~/lib/twcss";
import { Routes } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";
import { copyToClipboard, slugify } from "~/utils/misc";

import { Link } from "./";

export * from "./pages/resume";
export * from "./pages/my-favorite-music-and-mdx";

export function Code({ language, fileName, code, sourceURL }: Record<string, any>): any {
  const SiteTexts = getSiteTexts({ page: Routes.BLOG() });

  return (
    <section
      className="root tw-rounded-md tw-border twc-border-color-primary dark:tw-border-0 dark:tw-bg-gray-700"
      data-block
    >
      <section className="tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-2">
        <code className="tw-text-sm tw-font-bold">
          {fileName
            ? `// ${slugify(fileName)}`
            : sourceURL
            ? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
            : ""}
        </code>
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
      <section className="tw-text-right tw-p-2 tw-pt-1">
        {sourceURL && (
          <Link
            className="tw-block sm:tw-inline-block tw-ml-auto sm:tw-mr-4"
            href={sourceURL}
          >
            <img
              src="/static/images/icons/github.svg"
              alt="Github icon"
              className="tw-h-4 tw-w-4 tw-inline-block tw-align-middle tw-mr-1 dark:tw-rounded-full dark:twc-bg-secondary dark:tw-p-0.5"
            />
            <span className="tw-inline-block tw-text-sm dark:twc-text-color-primary">
              {SiteTexts.page.current_locale.see_source_code}
            </span>
          </Link>
        )}
        <button
          className="clipboard twc-text-color-links dark:twc-text-color-primary tw-block sm:tw-inline-block tw-ml-auto tw-mt-1 sm:tw-mt-0 tw-text-sm tw-font-bold tw-text-right"
          data-clipboard-text={code}
          onClick={copyToClipboard}
        >
          {SiteTexts.page.current_locale.copy_to_clipboard}
        </button>
      </section>

      <style jsx>{`
        .root pre,
        .root img {
          @apply tw-my-0;
        }

        .root pre {
          border-radius: 0;
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
    <section className="root tw-text-right" data-block>
      <Link
        className="twc-border-color-primary tw-border dark:tw-border-0 tw-flex sm:tw-inline-flex tw-p-4 twc-bg-secondary tw-rounded-md tw-items-center tw-relative tw-pr-8"
        href={url}
        styled={false}
      >
        <img
          src="/static/images/icons/github.svg"
          alt="Github icon"
          className="tw-h-8 tw-w-8 tw-mr-3"
        />
        <section className="tw-flex-1 tw-text-left">
          <h3>{name}</h3>
          <p className="tw-text-sm twc-text-color-primary">{description}</p>
        </section>

        <img
          src="/static/images/icons/link.svg"
          alt="Link icon"
          className="tw-absolute tw-top-2 tw-right-2 tw-h-4 tw-w-4"
        />
      </Link>

      <style jsx>{`
        .root img,
        .root h3,
        .root p {
          @apply tw-my-0;
        }

        .root h3 {
          @apply tw-text-base;
          @apply twc-text-color-secondary;

          @screen sm {
            @apply tw-text-lg;
          }
        }
      `}</style>
    </section>
  );
}

export function Title(Tag: any): any {
  return function TitleComponent({ children }: Record<string, any>): any {
    return <Tag id={slugify(children)}>{children}</Tag>;
  };
}
