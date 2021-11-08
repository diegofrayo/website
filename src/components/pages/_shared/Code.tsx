import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import classNames from "classnames";

import {
  Block,
  Button,
  Code as CodePrimitive,
  Icon,
  InlineText,
  Link,
} from "~/components/primitive";
import { useTranslation } from "~/i18n";
import twcss from "~/lib/twcss";
import { T_CodeProps, T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { generateSlug } from "~/utils/strings";

function Code({
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
    <Block className="dfr-Code" data-markdown-block>
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
                        return <InlineText key={key} {...getTokenProps({ token, key })} />;
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
        <Block className="tw-p-2 tw-pt-1.5 tw-text-sm tw-text-right tw-border dfr-border-primary tw-border-t-0 dark:tw-border-0 dark:tw-bg-gray-700 tw-rounded-b-md">
          {sourceURL && (
            <Link
              variant={Link.variant.SIMPLE}
              className="tw-block sm:tw-inline-block tw-ml-auto tw-font-bold sm:tw-mr-6 tw-mb-1 sm:tw-mb-0"
              href={sourceURL}
              external
            >
              <Icon
                icon={Icon.icon.GITHUB}
                wrapperClassName="tw-align-middle tw-mr-1.5"
                withDarkModeBackground
              />
              <InlineText className="tw-align-middle tw-inline-block">
                {t("page:see_source_code")}
              </InlineText>
            </Link>
          )}
          <Button
            variant={Button.variant.SIMPLE}
            className="tw-block sm:tw-inline-block tw-ml-auto tw-align-middle tw-font-bold"
            data-clipboard-text={code}
            onClick={copyToClipboard}
          >
            {t("page:copy_to_clipboard")}
          </Button>
        </Block>
      )}

      <style jsx>{`
        :global(.dfr-Code) :global(.dfr-CodePrimitive) {
          border-radius: 0;
        }
      `}</style>
    </Block>
  );
}

export default Code;

// --- Components ---

const Line = twcss.div`tw-table-row`;
const LineNo = twcss.span`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none`;
const LineContent = twcss.span`tw-table-cell`;
