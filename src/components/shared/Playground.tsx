import * as React from "react";
import classNames from "classnames";

import { Button, Block } from "~/components/primitive";
import type {
  T_CodeProps,
  T_ReactElement,
  T_ReactFunctionComponent,
  T_ReactRefObject,
} from "~/types";

import SourceCode from "./SourceCode";

type T_PlaygroundProps = Pick<T_CodeProps, "code" | "language"> & {
  Component: T_ReactFunctionComponent;
};

function Playground(props: T_PlaygroundProps): T_ReactElement {
  const {
    // props
    Component,
    code,
    language,

    // states
    contentRef,
    setSourceCodeTab,
    setOutputTab,

    // vars
    isSourceCodeTabSelected,
    isOutputTabSelected,
  } = useController(props);

  return (
    <Block
      className="dfr-Playground tw-flex tw-flex-col tw-border-4 tw-border-black dfr-bg-color-light-strong dark:tw-border-white"
      style={{ minHeight: 200 }}
      data-markdown-block
    >
      <Block
        className="tw-flex-1 tw-overflow-auto tw-p-0.5"
        style={{ maxHeight: 300 }}
        ref={contentRef}
      >
        {isSourceCodeTabSelected ? (
          <SourceCode
            language={language}
            code={code}
            showOnlySourceCode
          />
        ) : (
          <Component />
        )}
      </Block>
      <Block className="tw-flex-no-wrap tw-flex tw-border-t-4 tw-border-black tw-text-sm dark:tw-border-white">
        <Button
          variant={Button.variant.SIMPLE}
          className={classNames(
            "tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
            isSourceCodeTabSelected &&
              "tw-bg-black tw-font-bold tw-text-white hover:tw-opacity-100 dark:tw-bg-white dark:tw-text-black",
          )}
          onClick={setSourceCodeTab}
        >
          Source code
        </Button>
        <Button
          variant={Button.variant.SIMPLE}
          className={classNames(
            "tw-flex-1 tw-cursor-pointer tw-p-2 tw-text-center",
            isOutputTabSelected &&
              "tw-bg-black tw-font-bold tw-text-white hover:tw-opacity-100 dark:tw-bg-white dark:tw-text-black",
          )}
          onClick={setOutputTab}
        >
          Output
        </Button>
      </Block>

      <style jsx>{`
        :global(.dfr-Playground) :global(.dfr-Code) {
          box-shadow: none;
          margin: 0;
        }
      `}</style>
    </Block>
  );
}

export default Playground;

// --- Controller ---

function useController(props: T_PlaygroundProps): T_PlaygroundProps & {
  isSourceCodeTabSelected: boolean;
  isOutputTabSelected: boolean;
  setSourceCodeTab: () => void;
  setOutputTab: () => void;
  contentRef: T_ReactRefObject<HTMLDivElement>;
} {
  const [tab, setTab] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  function setSourceCodeTab() {
    setTab(0);

    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }

  function setOutputTab() {
    setTab(1);

    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }

  return {
    // props
    ...props,

    // states
    contentRef,
    setSourceCodeTab,
    setOutputTab,

    // vars
    isSourceCodeTabSelected: tab === 0,
    isOutputTabSelected: tab === 1,
  };
}
