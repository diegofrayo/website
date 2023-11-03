import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import {
	Block,
	Button,
	Collapsible,
	Icon,
	InlineText,
	Link,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import { CopyToClipboardPopover } from "~/components/shared";
import { withOnlyClientRender } from "~/hocs";
import { useDidMount, useEnhancedState } from "~/hooks";
import { withAuthRulesPage } from "~/modules/auth";
import { isContact, type T_Contact, type T_ContactsData } from "@diegofrayo/types/contacts";
import { isMobileDevice } from "@diegofrayo/utils/browser";
import { throwError } from "@diegofrayo/utils/misc";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";

export type T_ContactsPageProps = {
	data: T_ContactsData;
};

function ContactsPage({ data: contacts }: T_ContactsPageProps) {
	// --- HOOKS ---
	const [isAllCollapsiblesOpened, , toggleIsAllCollapsiblesOpened] = useEnhancedState(false);

	// --- STATES & REFS ---
	const [whatsAppLinksMode, setWhatsAppLinksMode] = React.useState<T_WhatsAppLinksMode>("web");

	// --- VARS ---
	const PAGE_TITLE = "Contactos";

	// --- EFFECTS ---
	useDidMount(() => {
		setWhatsAppLinksMode(isMobileDevice() ? "app" : "web");
	});

	// --- HANDLERS ---
	function handleToggleAllCollapsiblesOpenedClick(): void {
		toggleIsAllCollapsiblesOpened();
	}

	function handleToggleWhatsAppLinksModeClick(): void {
		setWhatsAppLinksMode(whatsAppLinksMode === "app" ? "web" : "app");
	}

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
			}}
		>
			<MainLayout title={PAGE_TITLE}>
				<Block className="tw-flex tw-flex-row tw-flex-wrap tw-justify-between tw-gap-y-2 tw-border tw-p-4 dr-bg-color-surface-200 dr-border-color-surface-300 print:tw-hidden">
					<Title
						is="h2"
						variant={Title.variant.SIMPLE}
						size={Title.size.MD}
						className="tw-leading-normal"
					>
						Configuración
					</Title>

					<Block className="tw-flex tw-gap-x-2 tw-gap-y-4">
						<Button
							variant={Button.variant.STYLED}
							className="tw-flex tw-items-center tw-justify-center"
							onClick={handleToggleWhatsAppLinksModeClick}
						>
							<Icon
								icon={Icon.icon.WHATSAPP_MONO}
								size={24}
							/>
							<Text className="tw-ml-1 tw-inline-block">
								<InlineText className="tw-hidden sm:tw-inline-block">Modo de links:</InlineText>{" "}
								<InlineText className="tw-inline-block tw-w-10 tw-text-left sm:tw-underline">
									{whatsAppLinksMode}
								</InlineText>
							</Text>
						</Button>

						<Button
							variant={Button.variant.STYLED}
							onClick={handleToggleAllCollapsiblesOpenedClick}
						>
							<Icon
								icon={
									isAllCollapsiblesOpened
										? Icon.icon.CHEVRON_DOUBLE_UP
										: Icon.icon.CHEVRON_DOUBLE_DOWN
								}
							/>
						</Button>
					</Block>
				</Block>

				<Space size={4} />

				<Contacts
					contacts={contacts}
					whatsAppLinksMode={whatsAppLinksMode}
					isAllCollapsiblesOpened={isAllCollapsiblesOpened}
				/>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(withOnlyClientRender(ContactsPage), {
	requireAuth: true,
	requirePin: true,
});

// --- COMPONENTS ---

type T_Contacts = {
	contacts: T_ContactsPageProps["data"];
	whatsAppLinksMode: T_WhatsAppLinksMode;
	isAllCollapsiblesOpened: boolean;
};

function Contacts({ contacts, whatsAppLinksMode, isAllCollapsiblesOpened }: T_Contacts) {
	return (
		<CategoryContacts
			categoryName="Contactos"
			contacts={contacts}
			whatsAppLinksMode={whatsAppLinksMode}
			isAllCollapsiblesOpened={isAllCollapsiblesOpened}
		/>
	);
}

type T_CategoryContactsProps = {
	categoryName: string;
	contacts: unknown;
	whatsAppLinksMode: T_WhatsAppLinksMode;
	isAllCollapsiblesOpened: boolean;
};

function CategoryContacts({
	categoryName,
	contacts,
	whatsAppLinksMode,
	isAllCollapsiblesOpened,
}: T_CategoryContactsProps) {
	return (
		<Block
			className="tw-mt-4"
			style={{ breakBefore: "left", pageBreakBefore: "left" }}
		>
			<Collapsible
				title={`${categoryName} [${countContacts(contacts)}]`}
				opened={isAllCollapsiblesOpened}
			>
				{v.isArray<T_Contact>(contacts) ? (
					<Block className="tw-flex tw-flex-wrap tw-pt-4">
						{contacts.map((contact) => {
							const contactPhone = v.isArray(contact.phone)
								? contact.phone.map((i) => i.value)
								: [contact.phone];

							return (
								<Block
									key={generateSlug(categoryName + contact.name)}
									className="tw-mb-8 tw-w-full tw-pr-4 last:tw-mb-4 sm:tw-w-1/2"
									style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
								>
									<Text className="tw-mb-1 tw-font-bold tw-leading-tight">{contact.name}</Text>
									<Block>
										{contactPhone.map((phone) => {
											return (
												<ContactPhone
													key={generateSlug(contact.name + phone)}
													phone={phone}
													country={contact.country}
												/>
											);
										})}
									</Block>
									<ContactLinks
										contact={contact}
										whatsAppLinksMode={whatsAppLinksMode}
									/>
								</Block>
							);
						})}
					</Block>
				) : v.isObject(contacts) ? (
					Object.entries(contacts).map(([subCategoryName, subCategoryContacts], index) => {
						return (
							<CategoryContacts
								key={generateSlug(`CategoryContacts-${subCategoryName}-${index}`)}
								categoryName={parseCategoryName(subCategoryName)}
								contacts={subCategoryContacts}
								whatsAppLinksMode={whatsAppLinksMode}
								isAllCollapsiblesOpened={isAllCollapsiblesOpened}
							/>
						);
					})
				) : (
					throwError(`Invalid contacts prop: "${typeof contacts}"`)
				)}
			</Collapsible>
		</Block>
	);
}

type T_ContactPhoneProps = {
	phone: string;
	country: T_Contact["country"];
};

function ContactPhone({ phone, country }: T_ContactPhoneProps) {
	// --- VARS ---
	const COUNTRIES_EMOJIS = {
		AR: "🇦🇷",
		BR: "🇧🇷",
		CA: "🇨🇦",
		CO: "🇨🇴",
		FR: "🇫🇷",
		GB: "🇬🇧",
		ISR: "🇮🇱",
		IT: "🇮🇹",
		MX: "🇲🇽",
		NI: "🇳🇮",
		PE: "🇵🇪",
		PY: "🇵🇾",
		SP: "🇪🇸",
		SW: "🇸🇪",
		USA: "🇺🇲",
		UY: "🇺🇾",
	};
	const [phoneCountryCode, phoneWithoutCode] = v.isNotEmptyString(phone)
		? phone.split(" ")
		: ["", ""];
	const isPhoneFromColombia = country === "CO";

	if (v.isEmptyString(phoneWithoutCode)) {
		return null;
	}

	return (
		<Block>
			<CopyToClipboardPopover textToCopy={isPhoneFromColombia ? phoneWithoutCode : phone}>
				<Button
					variant={Button.variant.SIMPLE}
					className="tw-inline-block tw-pr-1 tw-text-sm"
				>
					<InlineText className="tw-mr-1 tw-not-italic">{COUNTRIES_EMOJIS[country]}</InlineText>
					<InlineText className="tw-italic">
						{formatPhoneNumber(phoneWithoutCode, phoneCountryCode)}
					</InlineText>
				</Button>
			</CopyToClipboardPopover>
		</Block>
	);
}

function ContactLinks({
	contact,
	whatsAppLinksMode,
}: {
	contact: T_Contact;
	whatsAppLinksMode: T_WhatsAppLinksMode;
}) {
	return (
		<Block className="tw-flex tw-flex-wrap tw-gap-x-3 tw-gap-y-1">
			{v.isArray(contact.phone) ? (
				<Block className="tw-flex tw-w-full tw-flex-wrap tw-gap-3">
					{contact.phone.map((item) => {
						return (
							<WhastAppButton
								key={generateSlug(item.label)}
								phone={item.value}
								whatsAppLinksMode={whatsAppLinksMode}
							>
								<Icon
									icon={Icon.icon.WHATSAPP}
									size={16}
								/>
								<InlineText className="tw-mx-1 tw-text-sm tw-font-bold tw-capitalize tw-text-green-500">
									{item.label}
								</InlineText>
							</WhastAppButton>
						);
					})}
				</Block>
			) : v.isNotEmptyString(contact.phone) ? (
				<WhastAppButton
					phone={contact.phone}
					whatsAppLinksMode={whatsAppLinksMode}
				>
					<Icon
						icon={Icon.icon.WHATSAPP}
						size={24}
					/>
				</WhastAppButton>
			) : null}

			{v.isNotEmptyString(contact.instagram) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={`https://instagram.com/${contact.instagram}`}
					className="tw-inline-block"
					isExternalLink
				>
					<Icon
						icon={Icon.icon.INSTAGRAM}
						size={24}
					/>
				</Link>
			) : null}

			{v.isArray(contact.phone) ? (
				<Block className="tw-flex tw-w-full tw-flex-wrap tw-gap-3">
					{contact.phone.map((item) => {
						return (
							<PhoneButton
								key={generateSlug(item.label)}
								phone={item.value}
								country={contact.country}
							>
								<Icon
									icon={Icon.icon.PHONE_SOLID}
									color="tw-text-blue-500"
								/>
								<InlineText className="tw-mx-1 tw-text-sm tw-font-bold tw-capitalize tw-text-blue-500">
									{item.label}
								</InlineText>
							</PhoneButton>
						);
					})}
				</Block>
			) : v.isNotEmptyString(contact.phone) ? (
				<PhoneButton
					phone={contact.phone}
					country={contact.country}
				>
					<Icon
						icon={Icon.icon.PHONE_SOLID}
						size={24}
						color="tw-text-blue-500"
					/>
				</PhoneButton>
			) : null}

			{v.isArray(contact.phone) ? (
				<Block className="tw-flex tw-w-full tw-flex-wrap tw-gap-3">
					{contact.phone.map((item) => {
						return (
							<SMSButton
								key={generateSlug(item.label)}
								phone={item.value}
								country={contact.country}
							>
								<Icon
									icon={Icon.icon.CHAT_SOLID}
									color="tw-text-red-500"
								/>
								<InlineText className="tw-mx-1 tw-text-sm tw-font-bold tw-capitalize tw-text-red-500">
									{item.label}
								</InlineText>
							</SMSButton>
						);
					})}
				</Block>
			) : v.isNotEmptyString(contact.phone) ? (
				<SMSButton
					phone={contact.phone}
					country={contact.country}
				>
					<Icon
						icon={Icon.icon.CHAT_SOLID}
						size={24}
						color="tw-text-red-500"
					/>
				</SMSButton>
			) : null}

			{v.isNotEmptyString(contact.email) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={`mailto:${contact.email}`}
				>
					<Icon icon={Icon.icon.GMAIL} />
				</Link>
			) : null}
		</Block>
	);
}

type T_WhastAppButtonProps = {
	children: DR.React.Children;
	phone: string;
	whatsAppLinksMode: T_WhatsAppLinksMode;
};

function WhastAppButton({ children, phone, whatsAppLinksMode }: T_WhastAppButtonProps) {
	// --- VARS ---
	const isColombianHomePhoneNumber = phone.split(" ")[1]?.startsWith("606");
	const isAssistanceServiceNumber = phone.split(" ")[1]?.length === 3;

	// --- HANDLERS ---
	function composeWhatsAppUrl(): string {
		const url = new URLSearchParams();
		url.append("phone", phone.replace(" ", "").trim());
		url.append("text", "Hola!");

		return `https://${
			whatsAppLinksMode === "web" ? "web" : "api"
		}.whatsapp.com/send?${url.toString()}`;
	}

	if (isColombianHomePhoneNumber || isAssistanceServiceNumber) {
		return null;
	}

	return (
		<Link
			variant={Link.variant.SIMPLE}
			href={composeWhatsAppUrl()}
			isExternalLink
		>
			{children}
		</Link>
	);
}

type T_PhoneButtonProps = {
	children: DR.React.Children;
	phone: string;
	country: T_Contact["country"];
};

function PhoneButton({ children, phone, country }: T_PhoneButtonProps) {
	// --- VARS ---
	const isPhoneNumberFromColombia = country === "CO";

	// --- UTILS ---
	function generatePhoneLink(): string {
		return `tel:${phone.split(" ").slice(1).join("").trim()}`;
	}

	if (isPhoneNumberFromColombia) {
		return (
			<Link
				variant={Link.variant.SIMPLE}
				href={generatePhoneLink()}
				isExternalLink
			>
				{children}
			</Link>
		);
	}

	return null;
}

function SMSButton({ children, phone, country }: T_PhoneButtonProps) {
	// --- VARS ---
	const phoneWithoutCountryCode = phone.split(" ").slice(1).join("").trim();
	const isCellphoneNumber =
		phoneWithoutCountryCode.length === 10 && phoneWithoutCountryCode.startsWith("3");
	const isPhoneNumberFromColombia = country === "CO";

	// --- UTILS ---
	function generateSMSLink(): string {
		return `sms:${phoneWithoutCountryCode}&body=Hola!`;
	}

	if (isPhoneNumberFromColombia && isCellphoneNumber) {
		return (
			<Link
				variant={Link.variant.SIMPLE}
				href={generateSMSLink()}
				isExternalLink
			>
				{children}
			</Link>
		);
	}

	return null;
}

// --- UTILS ---

function formatPhoneNumber(phone: string, phoneCountryCode: string) {
	const phoneCleaned = `${phone}`.replace(/\D/g, "");

	const nineDigitsMatch = phoneCleaned.match(/^(\d{3})(\d{2})(\d{2})(\d{2})$/);
	if (nineDigitsMatch) {
		return `${phoneCountryCode} (${nineDigitsMatch[1]}) ${nineDigitsMatch[2]}-${nineDigitsMatch[3]}-${nineDigitsMatch[4]}`;
	}

	const tenDigitsMatch = phoneCleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
	if (tenDigitsMatch) {
		return `${phoneCountryCode} (${tenDigitsMatch[1]}) ${tenDigitsMatch[2]}-${tenDigitsMatch[3]}`;
	}

	const elevenDigitsMatch = phoneCleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
	if (elevenDigitsMatch) {
		return `${phoneCountryCode} (${elevenDigitsMatch[1]}) ${elevenDigitsMatch[2]}-${elevenDigitsMatch[3]}-${elevenDigitsMatch[4]}`;
	}

	return phone;
}

function countContacts(input: unknown): number {
	if (isContact(input)) {
		return 1;
	}

	if (v.isArray(input)) {
		return input.length;
	}

	if (v.isObject(input)) {
		return Object.values(input).reduce((result: number, categoryContacts) => {
			return result + countContacts(categoryContacts);
		}, 0);
	}

	throw new Error(`Error counting contacts => Invalid input type: "${typeof input}"`);
}

function parseCategoryName(input: string) {
	const items = input.split("-");

	if (items.length === 2) {
		return items[1];
	}

	return items[0];
}

// --- TYPES ---

type T_WhatsAppLinksMode = "app" | "web";
