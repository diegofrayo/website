import * as React from "react";

import ErrorPage from "~/components/pages/ErrorPage";

function Error(): any {
  return <ErrorPage statusCode={500} />;
}

export default Error;
