import * as React from "react";

import ErrorPage from "~/components/pages/ErrorPage";
import { getPageContentStaticProps } from "~/i18n";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function Page404(): T_ReactElement {
  return <ErrorPage />;
}

export default Page404;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.ERROR_404,
});
