import * as React from "react";

import ErrorPage from "~/components/pages/ErrorPage";

function Page500(): any {
  return <ErrorPage statusCode={500} />;
}

export default Page500;
