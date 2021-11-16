import * as React from "react";
import classNames from "classnames";

import { Icon, Input, Link, Block } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { focusElement, isSmallScreen } from "~/utils/browser";
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

  return (
    <Block>
      <Block className="tw-flex tw-flex-no-wrap tw-items-end tw-w-full">
        <Input
          id="input"
          label="Ingrese un número de celular"
          containerProps={{ className: "tw-flex-1 tw-mr-2" }}
          ref={inputRef}
          value={phone}
          placeholder="🇨🇴 +57"
          pattern="[0-9]{10}"
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
        <Link
          variant={Link.variant.SIMPLE}
          href={composeWhatsAppUrl()}
          className={classNames(
            "tw-self-end tw-flex",
            isInvalidPhone && "tw-pointer-events-none tw-opacity-50",
          )}
          id="button"
          isExternalUrl
        >
          <Icon icon={Icon.icon.WHATSAPP} size={48} />
        </Link>
      </Block>
      <Block className="tw-flex tw-mt-1 tw-justify-between tw-pr-14">
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
    if (isSmallScreen() || !inputRef.current) return;
    focusElement(inputRef.current);
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
    return `https://${isWebOptionSelected ? "web" : "api"}.whatsapp.com/send?phone=${
      phone.includes("+") ? "" : "+57"
    }${phone}`;
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
