import * as React from "react";
import classNames from "classnames";
import { useTheme } from "next-themes";

import { Block } from "~/components/primitive";
import { withSafeRenderingComponent } from "~/hocs";
import { T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";

function Styles(): T_ReactElement {
  return <Content />;
}

export default Styles;

// --- Components ---

const Content = withSafeRenderingComponent(function Content() {
  const { theme } = useTheme();

  const STYLES = {
    bg: ["dfr-bg-color-layout", "dfr-bg-color-primary"],
    text: ["dfr-text-color-primary", "dfr-text-color-secondary", "dfr-link-color-primarys"],
    border: ["dfr-border-color-primary"],
  };

  return (
    <Block>
      {Object.entries(STYLES).map(([property, classes]) => {
        if (property === "bg") {
          return <Section key="Section-bg" title="bg" classes={classes} theme={theme} />;
        }

        if (property === "text") {
          return <Section key="Section-text" title="text" classes={classes} theme={theme} />;
        }

        if (property === "border") {
          return <Section key="Section-border" title="border" classes={classes} theme={theme} />;
        }

        return null;
      })}
    </Block>
  );
});

function Section({ title, classes, theme }) {
  return (
    <Block is="section" className="tw-mb-8 tw-text-sm tw-text-right">
      <h2 className="tw-text-xl tw-mb-3">{title}</h2>
      <Block className="tw-flex tw-flex-wrap tw-justify-end">
        {classes.map((className, index) => {
          const classNameWithTheme = `${theme === "dark" ? "dark:" : ""}${className}`;

          return (
            <Block
              key={`${title}-${index}`}
              className="tw-w-full sm:tw-w-auto sm:tw-ml-4 tw-mb-4"
              role="button"
              data-clipboard-text={classNameWithTheme}
              onClick={copyToClipboard}
            >
              <Block
                className={classNames(
                  "tw-border tw-p-2 tw-text-left",
                  className,
                  `dark:${className}`,
                )}
              >
                i&apos;m a box with {title}
              </Block>
              <code className="tw-font-bold">{classNameWithTheme}</code>
            </Block>
          );
        })}
      </Block>
    </Block>
  );
}
