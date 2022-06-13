import * as React from "react";
import { toast } from "react-toastify";

import { Page } from "~/components/layout";
import { Input } from "~/components/primitive";
import { AuthService, withAuth } from "~/auth";
import { getPageContentStaticProps } from "~/i18n";
import { redirect, ROUTES } from "~/utils/routing";
import { getErrorMessage, reportError } from "~/utils/app";
import { isEmptyString } from "~/utils/validations";
import type {
  T_ReactElement,
  T_ReactOnChangeEventHandler,
  T_ReactOnKeyPressEventHandler,
} from "~/types";

function SignInPage(): T_ReactElement {
  const {
    // states & refs
    inputValue,
    isInputDisabled,

    // handlers
    onInputChange,
    onKeyPress,
  } = useController();

  return (
    <Page
      config={{
        title: "Iniciar sesión",
        disableSEO: true,
      }}
    >
      <form
        className="tw-p-4"
        onSubmit={(e): void => e.preventDefault()}
      >
        <Input
          id="username"
          type="username"
          name="username"
          value="diegofrayo"
          autoComplete="off"
          onChange={(): void => undefined}
          containerProps={{ className: "tw-hidden" }}
        />
        <Input
          id="password"
          type="password"
          label="Contraseña"
          value={inputValue}
          autoComplete="new-password"
          disabled={isInputDisabled}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
        />
      </form>
    </Page>
  );
}

export default withAuth(SignInPage, { denyLoggedIn: true });

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();

// --- Controller ---

type T_UseControllerReturn = {
  inputValue: string;
  isInputDisabled: boolean;
  onInputChange: T_ReactOnChangeEventHandler<HTMLInputElement>;
  onKeyPress: T_ReactOnKeyPressEventHandler<HTMLInputElement>;
};

function useController(): T_UseControllerReturn {
  // states & refs
  const [inputValue, setInputValue] = React.useState("");
  const [isInputDisabled, setIsInputDisabled] = React.useState(false);

  // handlers
  const onKeyPress: T_UseControllerReturn["onKeyPress"] = async function onKeyPress(
    event,
  ): Promise<void> {
    if (event.key !== "Enter" || isEmptyString(inputValue)) {
      return;
    }

    try {
      setIsInputDisabled(true);
      await AuthService.signIn({ password: inputValue });
      redirect(ROUTES.HOME);
    } catch (error) {
      reportError(error);

      toast.error(
        AuthService.isSignInError(error) && error.data.code === "AUTH_WRONG_PASSWORD"
          ? "Contraseña incorrecta."
          : getErrorMessage(error),
        {
          position: toast.POSITION.BOTTOM_CENTER,
          toastId: "sign-in",
        },
      );
    } finally {
      setIsInputDisabled(false);
    }
  };

  const onInputChange: T_UseControllerReturn["onInputChange"] = function onInputChange(event) {
    setInputValue(event.currentTarget.value);
  };

  return {
    // states & refs
    inputValue,
    isInputDisabled,

    // handlers
    onInputChange,
    onKeyPress,
  };
}
