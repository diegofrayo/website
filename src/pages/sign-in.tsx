import React, { useState } from "react";
import { toast } from "react-toastify";

import { Page, MainLayout } from "~/components/layout";
import { Input } from "~/components/primitive";
import { getPageContentStaticProps } from "~/i18n";
import AuthService from "~/services/auth";
import { T_ReactElement, T_PageContent } from "~/types";

type T_PageProps = {
  pageContent: T_PageContent;
};

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
      <MainLayout>
        <form onSubmit={(e) => e.preventDefault()}>
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
      </MainLayout>
    </Page>
  );
}

export default SignInPage;

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

      window.location.href = "/";
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
