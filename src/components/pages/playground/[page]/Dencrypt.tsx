import React, { useState, useRef, Fragment } from "react";

import { Space, Button, Input } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { copyToClipboard, focusElement, isSmallScreen } from "~/utils/browser";

function Dencrypt(): T_ReactElement {
  const {
    // states
    output,
    inputRef,

    // handlers
    handleEncrypt,
    handleDecrypt,
    onInputFocus,
  } = useController();

  return (
    <Fragment>
      <div className="tw-mb-8">
        <label htmlFor="input">
          <p className="tw-font-bold tw-cursor-pointer">Ingrese un texto</p>
          <Input id="input" className="tw-my-1" ref={inputRef} onClick={onInputFocus} />
        </label>
        <div className="tw-flex tw-flex-wrap tw-justify-between">
          <Button
            className="tw-inline-block tw-text-sm tw-mx-1 tw-font-bold"
            onClick={handleEncrypt}
          >
            encriptar
          </Button>
          <Button
            className="tw-inline-block tw-text-sm tw-mx-1 tw-font-bold"
            onClick={handleDecrypt}
          >
            desencriptar
          </Button>
        </div>
      </div>

      <Space size={10} variant={Space.variant.DASHED} />

      <div>
        <p className="tw-font-bold">Resultado</p>
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
          copiar
        </Button>
      </div>
    </Fragment>
  );
}

export default Dencrypt;

// --- Controller ---

function useController(): {
  output: string;
  inputRef: any;
  handleEncrypt: any;
  handleDecrypt: any;
  onInputFocus: any;
} {
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
      debugger;
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
    output,
    inputRef,

    // handlers
    handleEncrypt,
    handleDecrypt,
    onInputFocus,
  };
}
