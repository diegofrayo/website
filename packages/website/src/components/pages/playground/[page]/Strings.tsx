import React, { useState, useRef, RefObject, Fragment } from "react";

import { Space, Button } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { T_FormEvent, T_OnChangeEvent, T_OnClickEvent, T_ReactElement } from "~/types";
import { copyToClipboard, focusElement, isSmallScreen } from "~/utils/browser";
import { convertToCapitalLetter, generateSlug } from "~/utils/strings";

function Strings(): T_ReactElement {
  const {
    // states
    texts,
    textareaRef,

    // handlers
    handleTextAreaChange,
    handleCopyText,
  } = useController();

  return (
    <Fragment>
      <div>
        <p className="tw-font-bold tw-mb-1">type your text</p>
        <textarea
          className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full tw-rounded-md"
          style={{ minHeight: 50 }}
          ref={textareaRef}
          onChange={handleTextAreaChange}
          onClick={(e) => {
            try {
              e.currentTarget.focus();
              e.currentTarget.select();
            } catch (error) {
              console.error("Error focussing a textarea");
              console.error(error);
            }
          }}
        />
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.input}
          onClick={handleCopyText}
        >
          copy
        </Button>
      </div>

      <Space size={10} variant={Space.variant.DASHED} />

      <div className="tw-mb-4">
        <p className="tw-font-bold">slug</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.slug}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.slug}
          onClick={handleCopyText}
        >
          copy
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold tw-uppercase">uppercase</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.upper}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.upper}
          onClick={handleCopyText}
        >
          copy
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold tw-lowercase">lowercase</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.lower}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.lower}
          onClick={handleCopyText}
        >
          copy
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold tw-capitalize">capital letter</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.convertToCapitalLetter}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.convertToCapitalLetter}
          onClick={handleCopyText}
        >
          copy
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold">Upper case only the first word</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.convertToCapitalLetterOnlyFirst}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.convertToCapitalLetterOnlyFirst}
          onClick={handleCopyText}
        >
          copy
        </Button>
      </div>

      <style jsx>
        {`
          .output {
            min-height: 40px;
          }
        `}
      </style>
    </Fragment>
  );
}

export default Strings;

// --- Controller ---

type T_UseController = {
  texts: {
    input: string;
    upper: string;
    lower: string;
    convertToCapitalLetter: string;
    convertToCapitalLetterOnlyFirst: string;
    slug: string;
  };
  handleTextAreaChange: T_OnChangeEvent<HTMLTextAreaElement>;
  handleCopyText: (e: T_OnClickEvent) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
};

function useController(): T_UseController {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [texts, setTexts] = useState<T_UseController["texts"]>({
    input: "",
    upper: "",
    lower: "",
    convertToCapitalLetter: "",
    convertToCapitalLetterOnlyFirst: "",
    slug: "",
  });

  useDidMount(() => {
    if (isSmallScreen() || !textareaRef.current) return;
    focusElement(textareaRef.current);
  });

  function handleTextAreaChange(event: T_FormEvent<HTMLTextAreaElement>) {
    const text = event.currentTarget.value || "";

    setTexts({
      input: text,
      slug: generateSlug(text),
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      convertToCapitalLetter: convertToCapitalLetter(text),
      convertToCapitalLetterOnlyFirst: text ? text[0].toUpperCase() + text.substring(1) : "",
    });
  }

  function handleCopyText(e: T_OnClickEvent) {
    copyToClipboard(e);
  }

  return {
    // states
    texts,
    textareaRef,

    // handlers
    handleTextAreaChange,
    handleCopyText,
  };
}