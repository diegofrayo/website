import * as React from "react";

import Home from "~/components/pages/home";
import { getPageContentStaticProps } from "~/i18n";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function HomePage(): T_ReactElement {
  return <Home />;
}

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.HOME,
});
