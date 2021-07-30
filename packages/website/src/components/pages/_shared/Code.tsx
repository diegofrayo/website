import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import { Link, Icon, Code as CodePrimitive, Button } from "~/components/primitive";
import twcss from "~/lib/twcss";
import { T_CodeProps, T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { generateSlug } from "~/utils/strings";
import classNames from "classnames";
import { useTranslation } from "~/hooks";

function Code({
  language,
  fileName,
  code = "",
  sourceURL = "",
  showOnlySourceCode = false,
}: T_CodeProps): T_ReactElement {
  const { t } = useTranslation({ page: true });

  const codeTitle = fileName
    ? `// ${generateSlug(fileName)}`
    : sourceURL
    ? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
    : "";

  return (
    <div className="root dfr-Code" data-markdown-block>
      {!showOnlySourceCode && (
        <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-px-2 tw-py-2 tw-text-sm tw-font-mono tw-rounded-t-md tw-border dfr-border-color-primary tw-border-b-0 dark:tw-border-0 dark:tw-bg-gray-700">
          {codeTitle && (
            <code className="tw-w-full sm:tw-w-auto tw-font-bold tw-mb-2 sm:tw-mb-0 sm:tw-mr-4">
              {codeTitle}
            </code>
          )}
          <span className="tw-rounded-md tw-bg-yellow-300 tw-text-yellow-700 tw-text-xs tw-px-3 tw-py-1 tw-inline-block tw-font-bold tw-flex-shrink-0 tw-ml-auto">
            {language}
          </span>
        </div>
      )}

      <Highlight {...defaultProps} code={code} language={language} theme={dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <CodePrimitive
              className={classNames(
                className,
                "dark:tw-border-l dark:tw-border-r dark:tw-border-gray-700",
              )}
              style={style}
            >
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

      {!showOnlySourceCode && (
        <div className="tw-p-2 tw-pt-1.5 tw-text-sm tw-text-right tw-border dfr-border-color-primary tw-border-t-0 dark:tw-border-0 dark:tw-bg-gray-700 tw-rounded-b-md">
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
              <span className="tw-align-middle tw-inline-block">{t("page:see_source_code")}</span>
            </Link>
          )}
          <Button
            className="tw-block sm:tw-inline-block tw-ml-auto tw-font-bold tw-align-middle"
            data-clipboard-text={code}
            onClick={copyToClipboard}
          >
            {t("page:copy_to_clipboard")}
          </Button>
        </div>
      )}

      <style jsx>{`
        .root :global(.dfr-CodePrimitive) {
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
