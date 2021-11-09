import * as React from "react";

import { Space, Button, Input, Block, Text } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { decrypt, encrypt } from "~/utils/dencrypt";
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
    <React.Fragment>
      <Block className="tw-mb-8">
        <Input
          id="input"
          label="Ingrese un texto"
          containerProps={{ className: "tw-my-1" }}
          ref={inputRef}
          onClick={onInputFocus}
        />
        <Block className="tw-flex tw-flex-wrap tw-justify-between">
          <Button variant={Button.variant.DEFAULT} onClick={handleEncrypt}>
            encriptar
          </Button>
          <Button variant={Button.variant.DEFAULT} onClick={handleDecrypt}>
            desencriptar
          </Button>
        </Block>
      </Block>

      <Space size={10} variant={Space.variant.DASHED} />

      <Block>
        <Text className="tw-font-bold">Resultado</Text>
        <output
          className="tw-my-1 tw-border dfr-border-primary tw-block tw-p-3 tw-w-full"
          style={{ minHeight: 40 }}
        >
          {output}
        </output>
        <Button
          variant={Button.variant.DEFAULT}
          className="tw-block tw-ml-auto"
          data-clipboard-text={output}
          onClick={copyToClipboard}
        >
          copiar
        </Button>
      </Block>
    </React.Fragment>
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
  const [output, setOutput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  useDidMount(() => {
    if (isSmallScreen() || !inputRef.current) return;
    focusElement(inputRef.current);
  });

  async function handleEncrypt() {
    try {
      const encryptedText = await encrypt(inputRef.current?.value || "");

      setOutput(encryptedText);
    } catch (error) {
      console.error("Error encrypting data");
      console.error(error);

      setOutput("Error, el texto no fue encriptado :(");
    }
  }

  async function handleDecrypt() {
    try {
      const decryptedText = await decrypt(inputRef.current?.value || "");

      setOutput(decryptedText);
    } catch (error) {
      console.error("Error decrypting data");
      console.error(error);

      setOutput("Error, el texto no fue desencriptado :(");
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
