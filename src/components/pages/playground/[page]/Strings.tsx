import React from "react";

import { Space, Button, Input, Block, Text } from "~/components/primitive";
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
    <React.Fragment>
      <Block>
        <Text className="tw-font-bold tw-mb-1">Ingrese un texto</Text>
        <Input
          is="textarea"
          id="textarea"
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
      </Block>

      <Space size={10} variant={Space.variant.DASHED} />

      <Block className="tw-mb-4">
        <Text className="tw-font-bold">slug</Text>
        <output
          className="tw-border dfr-border-primary tw-block tw-p-3 tw-w-full tw-my-1"
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
      </Block>

      <Block className="tw-my-4">
        <Text className="tw-font-bold tw-uppercase">mayúsculas</Text>
        <output className="output tw-border dfr-border-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.upper}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.upper}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </Block>

      <Block className="tw-my-4">
        <Text className="tw-font-bold tw-lowercase">minúsculas</Text>
        <output className="output tw-border dfr-border-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.lower}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.lower}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </Block>

      <Block className="tw-my-4">
        <Text className="tw-font-bold tw-capitalize">letra capital</Text>
        <output className="output tw-border dfr-border-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.convertToCapitalLetter}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.convertToCapitalLetter}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </Block>

      <Block className="tw-my-4">
        <Text className="tw-font-bold">Mayúscula solo la primera palabra</Text>
        <output className="output tw-border dfr-border-primary tw-block tw-p-3 tw-w-full tw-my-1">
          {texts.convertToCapitalLetterOnlyFirst}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={texts.convertToCapitalLetterOnlyFirst}
          onClick={handleCopyText}
        >
          copiar
        </Button>
      </Block>
    </React.Fragment>
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
  textareaRef: React.RefObject<HTMLTextAreaElement>;
};

function useController(): T_UseController {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [texts, setTexts] = React.useState<T_UseController["texts"]>({
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
