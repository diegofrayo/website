import * as React from "react";

import type { T_ContactsData } from "@diegofrayo/types/contacts";
import { ContactsPage as ContactsPageComponent } from "../components";

export type T_ContactsPageProps = {
	data: T_ContactsData;
};

export default function ContactsPage({ data }: T_ContactsPageProps) {
	return (
		<ContactsPageComponent
			config={{ title: "Contactos", disableSEO: true }}
			variant="contacts"
			data={data}
		/>
	);
}
