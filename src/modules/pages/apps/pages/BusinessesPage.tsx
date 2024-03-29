import * as React from "react";

import { ContactsPage as ContactsPageComponent } from "../components";
import type { T_BusinessesPageProps } from "../types";

export default function BusinessesPage({ data }: T_BusinessesPageProps) {
	return (
		<ContactsPageComponent
			config={{ title: "Negocios", disableSEO: true }}
			variant="businesses"
			data={data}
		/>
	);
}
