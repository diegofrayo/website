import React, { useState, useRef, RefObject } from "react";

import { Page, MainLayout } from "~/components/layout";
import { Space, Button } from "~/components/primitive";
import { Routes } from "~/utils/routing";
import { useDidMount } from "~/hooks";
import { T_SiteTexts } from "~/types";
import { copyToClipboard, focusElement, isSmallScreen } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";
import { convertToCapitalLetter, generateSlug } from "~/utils/strings";

const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "strings";

function StringsPage(): JSX.Element {
  const { texts, textareaRef, handleTextAreaChange, handleCopyText } = usePageHook();

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <div>
          <p className="tw-font-bold tw-mb-1">type your text</p>
          <textarea
            className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full tw-rounded-md"
            ref={textareaRef}
            onChange={handleTextAreaChange}
            onClick={e => {
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

        <Space size={10} className="tw-border-t dfr-border-color-primary" />

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
      </MainLayout>

      <style jsx>
        {`
          textarea {
            min-height: 50px;
          }

          .output {
            min-height: 40px;
          }
        `}
      </style>
    </Page>
  );
}

export default StringsPage;

// --- Hooks ---

type T_OnClickEvent = React.MouseEvent<HTMLButtonElement>;

type T_UsePageHook = {
  texts: {
    input: string;
    upper: string;
    lower: string;
    convertToCapitalLetter: string;
    convertToCapitalLetterOnlyFirst: string;
    slug: string;
  };
  handleTextAreaChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleCopyText: (e: T_OnClickEvent) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
};

function usePageHook(): T_UsePageHook {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [texts, setTexts] = useState<T_UsePageHook["texts"]>({
    input: "",
    upper: "",
    lower: "",
    convertToCapitalLetter: "",
    convertToCapitalLetterOnlyFirst: "",
    slug: "",
  });

  useDidMount(() => {
    if (!textareaRef?.current || isSmallScreen()) return;
    focusElement(textareaRef.current);
  });

  function handleTextAreaChange(event: React.FormEvent<HTMLTextAreaElement>) {
    const text: string = event.currentTarget.value || "";

    setTexts({
      input: text,
      slug: generateSlug(text),
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      convertToCapitalLetter: convertToCapitalLetter(text),
      convertToCapitalLetterOnlyFirst: text ? text[0].toUpperCase() + text.substring(1) : "",
    });
  }

  function handleCopyText(e: T_OnClickEvent): void {
    copyToClipboard(e);
  }

  return {
    texts,
    handleTextAreaChange,
    handleCopyText,
    textareaRef,
  };
}
