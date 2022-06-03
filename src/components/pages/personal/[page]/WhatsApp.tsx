import * as React from "react";
import classNames from "classnames";

import { Icon, Input, Link, Block, Text } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import type { T_ReactElement } from "~/types";
import { copyToClipboard, focusElement, isMobile } from "~/utils/browser";
import { generateSlug, replaceAll } from "~/utils/strings";

function WhatsApp(): T_ReactElement {
  const {
    // states
    phone,
    inputRef,
    isInvalidPhone,
    isWebOptionSelected,

    // handlers
    onKeyPress,
    onChange,
    onRadioChange,
    composeWhatsAppUrl,
  } = useController();

  const whatsAppUrl = composeWhatsAppUrl();

  return (
    <Block>
      <Block className="tw-flex-no-wrap tw-flex tw-w-full tw-items-end">
        <Input
          id="input"
          label="Ingrese un número de celular"
          containerProps={{ className: "tw-flex-1 tw-mr-2" }}
          ref={inputRef}
          value={phone}
          placeholder="🇨🇴 +57"
          pattern="\+?[0-9]{10,15}"
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
        <Link
          variant={Link.variant.SIMPLE}
          href={whatsAppUrl}
          className={classNames(
            "tw-flex tw-self-end",
            isInvalidPhone && "tw-pointer-events-none tw-opacity-50",
          )}
          id="button"
          isExternalUrl
        >
          <Icon
            icon={Icon.icon.WHATSAPP}
            size={48}
          />
        </Link>
      </Block>
      <Block className="tw-mt-1 tw-flex tw-flex-row-reverse tw-justify-between tw-pr-14">
        <Block>
          <input
            type="radio"
            className="tw-mr-1"
            id="radio-app"
            name="option"
            value="app"
            checked={!isWebOptionSelected}
            onChange={onRadioChange}
          />
          <label htmlFor="radio-app">app</label>
        </Block>
        <Block>
          <input
            type="radio"
            className="tw-mr-1"
            id="radio-web"
            name="option"
            value="web"
            checked={isWebOptionSelected}
            onChange={onRadioChange}
          />
          <label htmlFor="radio-web">web</label>
        </Block>
      </Block>
      <Block className="tw-mt-3 tw-text-left sm:tw-text-center">
        <Text
          className="tw-inline-block tw-cursor-pointer tw-border tw-border-dashed tw-px-1 tw-text-xs tw-italic dfr-border-color-primary"
          data-clipboard-text={whatsAppUrl}
          onClick={copyToClipboard}
        >
          {whatsAppUrl}
        </Text>
      </Block>
    </Block>
  );
}

export default WhatsApp;

// --- Controller ---

function useController(): {
  phone: string;
  inputRef: any;
  onKeyPress: any;
  onChange: any;
  composeWhatsAppUrl: any;
  onRadioChange: any;
  isInvalidPhone: boolean;
  isWebOptionSelected: boolean;
} {
  const [phone, setPhone] = React.useState("");
  const [isWebOptionSelected, setIsWebOptionSelected] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isInvalidPhone, setIsInvalidPhone] = React.useState(true);

  useDidMount(() => {
    if (!inputRef.current) return;

    focusElement(inputRef.current);
    setIsWebOptionSelected(!isMobile());
  });

  React.useEffect(() => {
    setIsInvalidPhone(!inputRef?.current?.validity?.valid || !phone);
  }, [phone]);

  function onKeyPress(e) {
    if (e.key !== "Enter" || isInvalidPhone) return;
    document.getElementById("button")?.click();
  }

  function onChange(e) {
    const value = e.currentTarget.value;
    setPhone((value.includes("+") ? "+" : "") + replaceAll(generateSlug(value), "-", ""));
  }

  function onRadioChange(e) {
    setIsWebOptionSelected(e.currentTarget.value === "web");
  }

  function composeWhatsAppUrl() {
    const url = new URLSearchParams();
    url.append("phone", `${phone.includes("+") ? "" : "+57"}${phone}`);
    url.append("text", "Hey!");

    return `https://${isWebOptionSelected ? "web" : "api"}.whatsapp.com/send?${url.toString()}`;
  }

  return {
    // states
    phone,
    inputRef,
    isInvalidPhone,
    isWebOptionSelected,

    // handlers
    onKeyPress,
    onChange,
    onRadioChange,
    composeWhatsAppUrl,
  };
}
