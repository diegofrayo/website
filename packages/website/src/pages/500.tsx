import React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { T_ReactElement } from "~/types";

function Page500(): T_ReactElement {
  return <ErrorPage statusCode={500} />;
}

export default Page500;
