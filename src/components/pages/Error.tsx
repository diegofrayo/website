import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Routes } from "~/utils/constants";

function ErrorPage({ statusCode }: Record<string, unknown>): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[{ text: "Ir al inicio", url: Routes.HOME }]}
        title={`${statusCode === 404 ? "🙉" : "🙈"} Error ${statusCode}`}
      >
        <section>
          {statusCode === 404
            ? "Esta página no existe"
            : "Trataré de arreglarlo lo más pronto posible, sin afectar la meta del actual sprint para así lograr darle el mayor valor posible al cliente"}
        </section>
      </MainLayout>
    </Page>
  );
}

export default ErrorPage;
