import React from "react";

import ErrorPage from "~/components/pages/Error";

function Error(): any {
  return <ErrorPage statusCode={500} />;
}

export default Error;
