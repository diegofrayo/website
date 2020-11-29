import * as React from "react";

import { Page } from "~/components/layout";

function Home(): any {
  return (
    <Page>
      <div className="tw-p-4">
        <h1 className="tw-text-3xl tw-text-gray-900 tw-mb-4">
          Hola, soy <strong>Diego Rayo</strong> 👋
        </h1>

        <p className="tw-mb-8 tw-text-gray-700">
          Este es mi sitio web, acabo de migrarlo a Next.js y Vercel, todavía no se que
          voy a poner aquí, tengo planeado escribir sobre varios temas, especialmente
          JavaScript y React, de a poco lo iré construyendo
        </p>

        <p className="tw-text-center tw-text-6xl">👨‍💻</p>
      </div>
    </Page>
  );
}

export default Home;
