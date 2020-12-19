import * as React from "react";

import { ErrorPage } from "~/components";

function Error(): any {
  return <ErrorPage statusCode={500} />;
}

export default Error;
