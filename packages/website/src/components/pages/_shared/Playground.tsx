import React, { useState } from "react";
import classNames from "classnames";

import { Button } from "~/components/primitive";
import { T_CodeProps, T_Function, T_ReactElement, T_ReactFunctionComponent } from "~/types";

import Code from "./Code";

type T_PlaygroundProps = Pick<T_CodeProps, "code" | "language"> & {
  Component: T_ReactFunctionComponent;
};

function Playground({ Component, code, language }: T_PlaygroundProps): T_ReactElement {
  const { isSourceCodeTab, isOutputTab, setSourceCodeTab, setOutputTab } = useController();

  return (
    <div
      className="root tw-flex tw-flex-col tw-p-0.5 tw-border-4 tw-border-black dark:tw-border-white"
      style={{ minHeight: 200 }}
      data-markdown-block
    >
      <div className="tw-flex-1 tw-overflow-auto" style={{ maxHeight: 300 }}>
        {isSourceCodeTab ? <Code language={language} code={code} /> : <Component />}
      </div>
      <div className="tw-flex tw-flex-no-wrap tw-text-sm">
        <Button
          className={classNames(
            "tw-border dfr-border-color-primary dark:dfr-border-color-primary tw-flex-1 tw-text-center tw-cursor-pointer tw-p-2",
            isSourceCodeTab && "tw-font-bold dfr-bg-secondary dark:dfr-bg-secondary",
          )}
          onClick={setSourceCodeTab}
        >
          Source Code
        </Button>
        <Button
          className={classNames(
            "tw-border dfr-border-color-primary dark:dfr-border-color-primary tw-flex-1 tw-text-center tw-cursor-pointer tw-p-2",
            isOutputTab && "tw-font-bold dfr-bg-secondary dark:dfr-bg-secondary",
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
  isSourceCodeTab: boolean;
  isOutputTab: boolean;
  setSourceCodeTab: T_Function;
  setOutputTab: T_Function;
} {
  const [tab, setTab] = useState(0);

  function setSourceCodeTab() {
    setTab(0);
  }

  function setOutputTab() {
    setTab(1);
  }

  return {
    isSourceCodeTab: tab === 0,
    isOutputTab: tab === 1,
    setSourceCodeTab,
    setOutputTab,
  };
}
