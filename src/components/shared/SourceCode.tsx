import * as React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import classNames from "classnames";

import { Block, Button, Code, Icon, InlineText, Link, Space } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import twcss from "~/lib/twcss";
import type { T_CodeProps, T_ReactElement } from "~/types";
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
    <Block
      className="dfr-SourceCode dfr-bg-color-light-strong "
      data-markdown-block
    >
      {!showOnlySourceCode && (
        <Block className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-rounded-t-md tw-border tw-border-b-0 tw-px-2 tw-py-2 tw-font-mono tw-text-sm dfr-border-color-primary dark:tw-border-0 dark:tw-bg-gray-700">
          {codeTitle && <code className="tw-mr-4 tw-flex-1 tw-font-bold">{codeTitle}</code>}
          <InlineText className="tw-ml-auto tw-inline-block tw-flex-shrink-0 tw-bg-yellow-300 tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-text-yellow-700">
            {language}
          </InlineText>
        </Block>
      )}

      <Highlight
        {...defaultProps}
        code={code}
        language={language}
        theme={dracula}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <Code
              variant={Code.variant.MULTILINE}
              className={classNames(
                className,
                "dark:tw-border-l dark:tw-border-r dark:tw-border-gray-700",
              )}
              style={style}
            >
              {tokens.map((line, i) => {
                return (
                  <Line
                    key={i}
                    {...getLineProps({ line, key: i })}
                  >
                    <LineNo>{i + 1}</LineNo>
                    <LineContent>
                      {line.map((token, key) => {
                        return (
                          <InlineText
                            key={key}
                            {...getTokenProps({ token, key })}
                          />
                        );
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
        <Block className="tw-flex tw-flex-col tw-rounded-b-md tw-border tw-border-t-0 tw-p-2 tw-text-sm dfr-border-color-primary dark:tw-border-0 dark:tw-bg-gray-700 sm:tw-flex-row sm:tw-justify-end">
          {sourceURL && (
            <React.Fragment>
              <Link
                variant={Link.variant.SECONDARY}
                href={sourceURL}
                className="tw-text-right"
                isExternalUrl
              >
                <Icon
                  icon={Icon.icon.GITHUB}
                  withDarkModeBackground
                />
                <InlineText className="tw-ml-1 tw-lowercase">
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
            <Icon
              icon={Icon.icon.CLIPBOARD}
              withDarkModeBackground
            />
            <InlineText className="tw-ml-1 tw-lowercase">{t("page:copy_to_clipboard")}</InlineText>
          </Button>
        </Block>
      )}

      <style jsx>{`
        :global(.dfr-SourceCode) :global(.dfr-Code) {
          border-radius: 0;
          box-shadow: none;
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
