import React, { useState, useRef, Fragment } from "react";

import { Space, Button } from "~/components/primitive";
import { PlaygroundPageTemplate } from "~/components/pages/playground";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { copyToClipboard, focusElement, isSmallScreen } from "~/utils/browser";

function StupidPage(): T_ReactElement {
  return (
    <PlaygroundPageTemplate pageName="encrypt-lab">
      <Content />
    </PlaygroundPageTemplate>
  );
}

export default StupidPage;

// --- Components ---

function Content(): T_ReactElement {
  const [output, setOutput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const MY_STUPID_SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_KEY;

  useDidMount(() => {
    if (isSmallScreen() || !inputRef.current) return;
    focusElement(inputRef.current);
  });

  async function handleEncrypt() {
    try {
      const CryptoJS = await import("crypto-js");

      const encryptedText = CryptoJS.AES.encrypt(
        inputRef.current?.value,
        MY_STUPID_SECRET_KEY,
      ).toString();

      setOutput(encryptedText);
    } catch (error) {
      console.error("Error encrypting data");
      console.error(error);

      setOutput("Error, the text was not encrypted :(");
    }
  }

  async function handleDecrypt() {
    try {
      const CryptoJS = await import("crypto-js");

      const decryptedText = CryptoJS.AES.decrypt(
        inputRef.current?.value,
        MY_STUPID_SECRET_KEY,
      ).toString(CryptoJS.enc.Utf8);

      if (!decryptedText) throw new Error("Text was not decrypted");

      setOutput(decryptedText);
    } catch (error) {
      console.error("Error decrypting data");
      console.error(error);

      setOutput("Error, the text was not decrypted :(");
    }
  }

  return (
    <Fragment>
      <div className="tw-mb-8">
        <label htmlFor="input">
          <p className="tw-font-bold tw-cursor-pointer">type your text</p>
          <input
            id="input"
            className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
            ref={inputRef}
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
        </label>
        <div className="tw-flex tw-flex-wrap tw-justify-between">
          <Button
            className="tw-inline-block tw-text-sm tw-mx-1 tw-font-bold"
            onClick={handleEncrypt}
          >
            encrypt
          </Button>
          <Button
            className="tw-inline-block tw-text-sm tw-mx-1 tw-font-bold"
            onClick={handleDecrypt}
          >
            decrypt
          </Button>
        </div>
      </div>

      <Space size={10} variant={Space.variant.DASHED} />

      <div>
        <p className="tw-font-bold">output</p>
        <output
          className="tw-my-1 tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full"
          style={{ minHeight: 40 }}
        >
          {output}
        </output>
        <Button
          className="tw-block tw-ml-auto tw-text-sm"
          data-clipboard-text={output}
          onClick={copyToClipboard}
        >
          copy
        </Button>
      </div>
    </Fragment>
  );
}