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
    onInputFocus,
  } = useController();

  return (
    <Fragment>
      <div>
        <p className="tw-font-bold tw-mb-1">Ingrese un texto</p>
        <textarea
          className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full tw-rounded-md"
          style={{ minHeight: 50 }}
          ref={textareaRef}
          onChange={handleTextAreaChange}
          onClick={onInputFocus}
        />
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.input}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </div>

      <Space size={10} variant={Space.variant.DASHED} />

      <div className="tw-mb-4">
        <p className="tw-font-bold">slug</p>
        <output
          className="tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1"
          style={{ minHeight: 40 }}
        >
          {texts.slug}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.slug}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold tw-uppercase">mayúsculas</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.upper}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.upper}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold tw-lowercase">minúsculas</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.lower}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.lower}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold tw-capitalize">letra capital</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.convertToCapitalLetter}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.convertToCapitalLetter}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </div>

      <div className="tw-my-4">
        <p className="tw-font-bold">Mayúscula solo la primera palabra</p>
        <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.convertToCapitalLetterOnlyFirst}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.convertToCapitalLetterOnlyFirst}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </div>
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
  onInputFocus: any;
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

  function onInputFocus(e) {
    try {
      e.currentTarget.focus();
      e.currentTarget.select();
    } catch (error) {
      console.error("Error focussing a textarea");
      console.error(error);
    }
  }

  return {
    // states
    texts,
    textareaRef,

    // handlers
    handleTextAreaChange,
    handleCopyText,
    onInputFocus,
  };
}
