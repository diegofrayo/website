import * as React from "react";

import { ErrorPage } from "~/components";

function Page404(): any {
  return <ErrorPage statusCode={404} />;
}

export default Page404;