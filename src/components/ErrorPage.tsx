import * as React from "react";

import { Routes } from "~/utils/constants";

import MainLayout from "./MainLayout";
import Page from "./Page";

function ErrorPage({ statusCode }: Record<string, unknown>): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[{ text: "Ir al inicio", url: Routes.HOME }]}
        title={`${statusCode === 404 ? "🙉" : "🙈"} Error ${statusCode}`}
      >
        <p>
          {statusCode === 404
            ? "Esta página no existe"
            : "Trataré de arreglar el error lo más pronto posible, sin afectar la meta del actual sprint para así lograr darle el mayor valor posible al cliente"}
        </p>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
