import React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { T_ReactFCReturn } from "~/types";

function Error(): T_ReactFCReturn {
  return <ErrorPage statusCode={500} />;
}

export default Error;
