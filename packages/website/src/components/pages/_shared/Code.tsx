import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import { Link, Icon, Code as CodePrimitive, Button } from "~/components/primitive";
import twcss from "~/lib/twcss";
import { T_CodeProps, T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";
import { generateSlug, replaceAll } from "~/utils/strings";

function Code({ language, fileName, code, sourceURL }: T_CodeProps): T_ReactElement {
  const SiteTexts = getSiteTexts({ page: ROUTES.BLOG });

  const codeTitle = fileName
    ? `// ${generateSlug(fileName)}`
    : sourceURL
    ? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
    : "";

  return (
    <div
      className="root tw-rounded-md tw-border-t tw-border-gray-100 dark:tw-border-0 dark:tw-bg-gray-700 tw-shadow-lg"
      data-markdown-block
    >
      <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-px-2 tw-py-2 tw-text-sm tw-font-mono">
        {codeTitle && (
          <code className="tw-w-full sm:tw-w-auto tw-font-bold tw-mb-2 sm:tw-mb-0 sm:tw-mr-4">
            {codeTitle}
          </code>
        )}
        <span className="tw-rounded-md tw-bg-yellow-300 tw-text-yellow-700 tw-text-xs tw-px-3 tw-py-1 tw-inline-block tw-font-bold tw-flex-shrink-0 tw-ml-auto">
          {language}
        </span>
      </div>

      <Highlight
        {...defaultProps}
        code={replaceAll(code, "[BR]", "")}
        language={language}
        theme={dracula}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <CodePrimitive className={className} style={style}>
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
            </CodePrimitive>
          );
        }}
      </Highlight>
      <div className="tw-p-2 tw-pt-1.5 tw-text-sm tw-text-right">
        {sourceURL && (
          <Link
            className="tw-block sm:tw-inline-block tw-ml-auto tw-font-bold sm:tw-mr-6 tw-mb-1 sm:tw-mb-0"
            href={sourceURL}
            variant={Link.variant.SIMPLE}
          >
            <Icon
              icon={Icon.icon.GITHUB}
              wrapperClassName="tw-align-middle tw-mr-1.5"
              withDarkModeBackground
            />
            <span className="tw-align-middle tw-inline-block">
              {SiteTexts.page.current_locale.see_source_code}
            </span>
          </Link>
        )}
        <Button
          className="tw-block sm:tw-inline-block tw-ml-auto tw-font-bold tw-align-middle"
          data-clipboard-text={code}
          onClick={copyToClipboard}
        >
          {SiteTexts.page.current_locale.copy_to_clipboard}
        </Button>
      </div>

      <style jsx>{`
        .root :global(.dfr-Code) {
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
