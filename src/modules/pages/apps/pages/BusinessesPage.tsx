import * as React from "react";

import type { T_BusinessesData } from "@diegofrayo/types/businesses";
import { ContactsPage as ContactsPageComponent } from "../components";

export type T_BusinessesPageProps = {
	data: T_BusinessesData;
};

export default function BusinessesPage({ data }: T_BusinessesPageProps) {
	return (
		<ContactsPageComponent
			config={{ title: "Negocios", disableSEO: true }}
			variant="businesses"
			data={data}
		/>
	);
}
