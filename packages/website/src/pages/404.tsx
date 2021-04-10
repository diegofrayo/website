import React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { T_ReactFCReturn } from "~/types";

function Page404(): T_ReactFCReturn {
  return <ErrorPage statusCode={404} />;
}

export default Page404;
