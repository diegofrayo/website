import * as React from "react";

import { ContactsPage as ContactsPageComponent } from "../components";
import type { T_ContactsPageProps } from "../types";

export default function ContactsPage({ data }: T_ContactsPageProps) {
	return (
		<ContactsPageComponent
			config={{ title: "Contactos", disableSEO: true }}
			data={data}
		/>
	);
}
