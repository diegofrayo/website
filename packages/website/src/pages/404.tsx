import React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { T_ReactElement } from "~/types";

function Page404(): T_ReactElement {
  return <ErrorPage statusCode={404} />;
}

export default Page404;
