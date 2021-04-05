import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import { Link, Image } from "~/components/primitive";
import Routes from "~/data/routes.json";
import { useAssets } from "~/hooks";
import twcss from "~/lib/twcss";
import { TypeCodeProps, TypePagesRoutes } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";
import { generateSlug } from "~/utils/strings";

function Code({ language, fileName, code, sourceURL }: TypeCodeProps): any {
  const { BlogAssets } = useAssets();

  const SiteTexts = getSiteTexts({ page: Routes.BLOG as TypePagesRoutes });

  return (
    <div
      className="Code root tw-rounded-md tw-border dfr-border-color-primary dark:tw-border-0 dark:tw-bg-gray-700"
      data-block
    >
      <div className="tw-flex tw-items-center tw-justify-between tw-px-2 tw-py-2">
        <code className="tw-text-sm tw-font-bold">
          {fileName
            ? `// ${generateSlug(fileName)}`
            : sourceURL
            ? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
            : ""}
        </code>
        <span className="tw-rounded-md tw-bg-yellow-300 tw-text-yellow-700 tw-text-xs tw-px-3 tw-py-1 tw-inline-block tw-font-bold tw-flex-shrink-0 tw-ml-4 tw-font-mono">
          {language}
        </span>
      </div>

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
      <div className="tw-text-right tw-p-2 tw-pt-1">
        {sourceURL && (
          <Link className="tw-block sm:tw-inline-block tw-ml-auto sm:tw-mr-4" href={sourceURL}>
            <Image
              src={BlogAssets.GITHUB}
              alt="Github icon"
              className="tw-h-4 tw-w-4 tw-inline-block tw-align-middle tw-mr-1 dark:tw-rounded-full dark:dfr-bg-secondary dark:tw-p-0.5"
            />
            <span className="tw-inline-block tw-text-sm dark:dfr-text-color-primary">
              {SiteTexts.page.current_locale.see_source_code}
            </span>
          </Link>
        )}
        <button
          className="clipboard dfr-text-color-links dark:dfr-text-color-primary tw-block sm:tw-inline-block tw-ml-auto tw-mt-1 sm:tw-mt-0 tw-text-sm tw-font-bold tw-text-right"
          data-clipboard-text={code}
          onClick={copyToClipboard}
        >
          {SiteTexts.page.current_locale.copy_to_clipboard}
        </button>
      </div>

      <style jsx>{`
        .root pre,
        .root :global(img) {
          @apply tw-my-0;
        }

        .root pre {
          border-radius: 0;
        }
      `}</style>
    </div>
  );
}

export default Code;

// --- Components ---

const Line = twcss.div`tw-table-row`;
const LineNo = twcss.span`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none`;
const LineContent = twcss.span`tw-table-cell`;
