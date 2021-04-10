import React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { T_ReactFCReturn } from "~/types";

function Page500(): T_ReactFCReturn {
  return <ErrorPage statusCode={500} />;
}

export default Page500;
