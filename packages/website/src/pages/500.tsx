import React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";
import { getPageContentStaticProps } from "~/server/i18n";

function Page500(): T_ReactElement {
  return <ErrorPage />;
}

export default Page500;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.ERROR_500,
});
