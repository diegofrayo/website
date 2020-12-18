import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

import { CURRENT_LOCALE } from "~/utils/constants";

class MyDocument extends Document {
  render(): any {
    return (
      <Html lang={CURRENT_LOCALE}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
