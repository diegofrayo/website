import React, { useState, useRef } from "react";
import classNames from "classnames";

import { Button } from "~/components/primitive";
import {
  T_CodeProps,
  T_Function,
  T_ReactElement,
  T_ReactFunctionComponent,
  T_ReactRefObject,
} from "~/types";

import Code from "./Code";

type T_PlaygroundProps = Pick<T_CodeProps, "code" | "language"> & {
  Component: T_ReactFunctionComponent;
};

function Playground({ Component, code, language }: T_PlaygroundProps): T_ReactElement {
  const {
    isSourceCodeTabSelected,
    isOutputTabSelected,
    setSourceCodeTab,
    setOutputTab,
    contentRef,
  } = useController();

  return (
    <div
      className="root tw-flex tw-flex-col tw-border-4 tw-border-black dark:tw-border-white"
      style={{ minHeight: 200 }}
      data-markdown-block
    >
      <div
        className="tw-flex-1 tw-overflow-auto tw-p-0.5"
        style={{ maxHeight: 300 }}
        ref={contentRef}
      >
        {isSourceCodeTabSelected ? (
          <Code language={language} code={code} showOnlySourceCode />
        ) : (
          <Component />
        )}
      </div>
      <div className="tw-flex tw-flex-no-wrap tw-text-sm tw-border-t-4 tw-border-black dark:tw-border-white">
        <Button
          className={classNames(
            "tw-flex-1 tw-text-center tw-cursor-pointer tw-p-2",
            isSourceCodeTabSelected &&
              "tw-font-bold tw-underline dfr-bg-secondary dark:dfr-bg-secondary",
          )}
          onClick={setSourceCodeTab}
        >
          Source Code
        </Button>
        <Button
          className={classNames(
            "tw-flex-1 tw-text-center tw-cursor-pointer tw-p-2",
            isOutputTabSelected &&
              "tw-font-bold tw-underline dfr-bg-secondary dark:dfr-bg-secondary",
          )}
          onClick={setOutputTab}
        >
          Output
        </Button>
      </div>

      <style jsx>{`
        .root :global(.dfr-Code) {
          box-shadow: none;
          height: 100%;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default Playground;

// --- Controller ---

function useController(): {
  isSourceCodeTabSelected: boolean;
  isOutputTabSelected: boolean;
  setSourceCodeTab: T_Function;
  setOutputTab: T_Function;
  contentRef: T_ReactRefObject<HTMLDivElement>;
} {
  const [tab, setTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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
    isSourceCodeTabSelected: tab === 0,
    isOutputTabSelected: tab === 1,
    setSourceCodeTab,
    setOutputTab,
    contentRef,
  };
}
