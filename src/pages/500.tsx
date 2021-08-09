import React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { getPageContentStaticProps } from "~/i18n";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function Page500(): T_ReactElement {
  return <ErrorPage />;
}

export default Page500;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.ERROR_500,
});
