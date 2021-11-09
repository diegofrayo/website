import * as React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import classNames from "classnames";

import { Block, Button, Code, Icon, InlineText, Link, Space } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import twcss from "~/lib/twcss";
import { T_CodeProps, T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { generateSlug } from "~/utils/strings";

function SourceCode({
  language,
  fileName,
  code = "",
  sourceURL = "",
  showOnlySourceCode = false,
}: T_CodeProps): T_ReactElement {
  const { t } = useTranslation();

  const codeTitle = fileName
    ? `// ${generateSlug(fileName)}`
    : sourceURL
    ? `// ${sourceURL.slice(sourceURL.lastIndexOf("/") + 1, sourceURL.length)}`
    : "";

  return (
    <Block className="dfr-SourceCode" data-markdown-block>
      {!showOnlySourceCode && (
        <Block className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-px-2 tw-py-2 tw-text-sm tw-font-mono tw-rounded-t-md tw-border dfr-border-primary tw-border-b-0 dark:tw-border-0 dark:tw-bg-gray-700">
          {codeTitle && (
            <code className="tw-w-full sm:tw-w-auto tw-font-bold tw-mb-2 sm:tw-mb-0 sm:tw-mr-4">
              {codeTitle}
            </code>
          )}
          <InlineText className="tw-rounded-md tw-bg-yellow-300 tw-text-yellow-700 tw-text-xs tw-px-3 tw-py-1 tw-inline-block tw-font-bold tw-flex-shrink-0 tw-ml-auto">
            {language}
          </InlineText>
        </Block>
      )}

      <Highlight {...defaultProps} code={code} language={language} theme={dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <Code
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
                        return <InlineText key={key} {...getTokenProps({ token, key })} />;
                      })}
                    </LineContent>
                  </Line>
                );
              })}
            </Code>
          );
        }}
      </Highlight>

      {!showOnlySourceCode && (
        <Block className="dfr-border-primary tw-flex tw-flex-col tw-p-2 tw-text-sm tw-border tw-border-t-0 tw-rounded-b-md sm:tw-flex-row sm:tw-justify-end dark:tw-border-0 dark:tw-bg-gray-700">
          {sourceURL && (
            <React.Fragment>
              <Link
                variant={Link.variant.SECONDARY}
                href={sourceURL}
                className="tw-text-right"
                external
              >
                <Icon icon={Icon.icon.GITHUB} withDarkModeBackground />
                <InlineText className="tw-lowercase tw-ml-1.5">
                  {t("page:see_source_code")}
                </InlineText>
              </Link>
              <Space responsive="tw-block tw-mb-1 tw-mr-0 sm:tw-inline-block sm:tw-mb-0 sm:tw-mr-6" />
            </React.Fragment>
          )}
          <Button
            variant={Button.variant.DEFAULT}
            className="tw-text-right"
            data-clipboard-text={code}
            onClick={copyToClipboard}
          >
            {t("page:copy_to_clipboard")}
          </Button>
        </Block>
      )}

      <style jsx>{`
        :global(.dfr-SourceCode) :global(.dfr-Code) {
          border-radius: 0;
        }
      `}</style>
    </Block>
  );
}

export default SourceCode;

// --- Components ---

const Line = twcss.div`tw-table-row`;
const LineNo = twcss.span`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none`;
const LineContent = twcss.span`tw-table-cell`;
