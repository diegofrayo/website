import { type T_BusinessesData } from "@diegofrayo/types/businesses";
import { type T_ContactsData } from "@diegofrayo/types/contacts";

export type T_BusinessesPageProps = {
	data: T_BusinessesData;
};

export type T_ContactsPageProps = {
	data: T_ContactsData;
};

export type T_WhatsAppLinksMode = "app" | "web";
