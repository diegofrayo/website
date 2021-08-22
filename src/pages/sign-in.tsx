import React, { useState } from "react";
import { toast } from "react-toastify";

import { Page } from "~/components/layout";
import { Input } from "~/components/primitive";
import { AuthService, withAuth } from "~/auth";
import { getPageContentStaticProps } from "~/i18n";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function SignInPage(): T_ReactElement {
  const {
    // states
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
      <form className="tw-p-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          id="input"
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

function useController() {
  const [inputValue, setInputValue] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  async function onKeyPress(e) {
    if (e.key !== "Enter" || !inputValue) return;

    try {
      setIsInputDisabled(true);

      await AuthService.signIn({ password: inputValue });

      window.location.href = ROUTES.HOME;
    } catch (error) {
      console.error(error);

      toast.error(
        error.data?.code === "AUTH_WRONG_PASSWORD"
          ? "Contraseña incorrecta."
          : error.message || "Error en la petición",
      );
    } finally {
      setIsInputDisabled(false);
    }
  }

  function onInputChange(e) {
    setInputValue(e.currentTarget.value);
  }

  return {
    // states
    inputValue,
    isInputDisabled,

    // handlers
    onInputChange,
    onKeyPress,
  };
}
