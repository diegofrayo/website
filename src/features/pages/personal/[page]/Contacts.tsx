import * as React from "react";
import classNames from "classnames";

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
} from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { withAuthPage } from "~/features/auth";
import { useDidMount, useEnhancedState } from "~/hooks";
import { isServer } from "~/utils/app";
import { handleCopyToClipboardClick, isMobileDevice } from "~/utils/browser";
import { formatPhoneNumber } from "~/utils/formatting";
import { generateSlug } from "~/utils/strings";
import { isEmptyString, isNotEmptyString } from "~/utils/validations";
import type { T_Object, T_ReactChildren, T_ReactElement, T_ReactElementNullable } from "~/types";

import styles from "./Contacts.styles.module.css";

type T_ContactsProps = {
	contacts: T_Object<T_GroupOfContacts>;
};

function Contacts({ contacts }: T_ContactsProps): T_ReactElementNullable {
	// hooks
	const [isAllCollapsibleOpened, setAllCollapsibleOpened, toggleIsAllCollapsibleOpened] =
		useEnhancedState(false);

	// states & refs
	const { current: totalOfContacts } = React.useRef<number>(countAllContacts(contacts));
	const [whatsAppOption, setWhatsAppOption] = React.useState<T_WhatsAppOption>("api");

	// vars
	const PAGE_TITLE = "Contacts";

	// effects
	useDidMount(() => {
		setWhatsAppOption(isMobileDevice() ? "api" : "web");
	});

	// handlers
	function handleToggleAllCollapsibleOpenedClick(): void {
		toggleIsAllCollapsibleOpened();
	}

	function handlePrintClick(): void {
		setAllCollapsibleOpened(true);
		setWhatsAppOption("api");
		setTimeout(() => {
			window.print();
		}, 1000);
	}

	function handleToggleWhatsAppOptionClick(): void {
		setWhatsAppOption(whatsAppOption === "api" ? "web" : "api");
	}

	if (isServer()) {
		return null;
	}

	return (
		<Page
			config={{
				title: PAGE_TITLE,
				disableSEO: true,
			}}
		>
			<MainLayout title={`${PAGE_TITLE}`}>
				<Block>
					<Block className="tw-flex tw-flex-col tw-items-center tw-justify-center sm:tw-flex-row sm:tw-justify-between">
						<Block className="tw-text-center sm:tw-text-left">
							<InlineText
								is="strong"
								className="tw-mr-1"
							>
								Número total de contactos:
							</InlineText>
							<InlineText>{totalOfContacts}</InlineText>
						</Block>
						<Block className="tw-hidden print:tw-hidden sm:tw-block">
							<Button
								variant={Button.variant.DEFAULT}
								onClick={handleToggleWhatsAppOptionClick}
							>
								<InlineText className="tw-mr-1 tw-inline-block tw-text-right tw-text-xs tw-font-bold">
									{whatsAppOption}
								</InlineText>
								<Icon
									icon={Icon.icon.WHATSAPP}
									size={24}
								/>
							</Button>
							<Space
								size={1}
								orientation="v"
							/>
							<Button
								variant={Button.variant.SIMPLE}
								onClick={handleToggleAllCollapsibleOpenedClick}
							>
								<Icon
									icon={
										isAllCollapsibleOpened
											? Icon.icon.CHEVRON_DOUBLE_UP
											: Icon.icon.CHEVRON_DOUBLE_DOWN
									}
								/>
							</Button>
							<Space
								size={1}
								orientation="v"
							/>
							<Button
								variant={Button.variant.SIMPLE}
								onClick={handlePrintClick}
							>
								<Icon icon={Icon.icon.PRINTER} />
							</Button>
						</Block>
					</Block>
					<Space
						size={4}
						variant={Space.variant.DASHED}
					/>
				</Block>

				<Block>
					{Object.entries(contacts).map(([groupName, groupData]: [string, T_GroupOfContacts]) => {
						const parsedGroupName = groupName.split("-").slice(1).join("-");

						if (Array.isArray(groupData)) {
							return (
								<ContactsGroup
									key={generateSlug(parsedGroupName)}
									groupName={parsedGroupName}
									contacts={groupData}
									collapsibleOpened={isAllCollapsibleOpened}
									whatsAppOption={whatsAppOption}
								/>
							);
						}

						return (
							<Collapsible
								key={generateSlug(groupName)}
								title={`${parsedGroupName} [${countGroupOfContacts(groupData)}]`}
								className="tw-mb-8 last:tw-mb-0"
								opened={isAllCollapsibleOpened}
							>
								{Object.entries(groupData).map(
									([subGroupName, subGroupContacts]: [string, T_Contact[]]) => {
										const parsedSubGroupName = subGroupName.split("-").slice(1).join("-");

										return (
											<ContactsGroup
												key={generateSlug(parsedSubGroupName)}
												groupName={parsedSubGroupName}
												contacts={subGroupContacts}
												collapsibleOpened={isAllCollapsibleOpened}
												whatsAppOption={whatsAppOption}
											/>
										);
									},
								)}
							</Collapsible>
						);
					})}
				</Block>
				<Space
					size={4}
					variant={Space.variant.DASHED}
				/>

				<Block>
					<Link
						variant={Link.variant.PRIMARY}
						href="https://www.notion.so/diegofrayo/Negocios-y-servicios-9fba1e55789746cfa9fcaab908fcc794"
						isExternalLink
					>
						<Icon
							icon={Icon.icon.LINK}
							wrapperClassName="tw-mr-1"
						/>
						<InlineText>Negocios y servicios</InlineText>
					</Link>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthPage<T_ContactsProps>(Contacts);

// --- Components ---

type T_ContactsGroupProps = {
	groupName: string;
	contacts: T_Contact[];
	collapsibleOpened: boolean;
	whatsAppOption: T_WhatsAppOption;
};

function ContactsGroup({
	groupName,
	contacts,
	collapsibleOpened,
	whatsAppOption,
}: T_ContactsGroupProps): T_ReactElement {
	return (
		<div className="root tw-mb-8 last:tw-mb-0">
			<Collapsible
				title={`${groupName} [${countGroupOfContacts(contacts)}]`}
				opened={collapsibleOpened}
			>
				<Block className="tw-flex tw-flex-wrap">
					{contacts.map((contact) => {
						const contactPhone = Array.isArray(contact.phone)
							? contact.phone.map((i) => i.value)
							: [contact.phone];

						return (
							<Block
								key={generateSlug(contact.name)}
								className="contact-container tw-mb-8 tw-w-full tw-pr-4 sm:tw-w-1/2"
							>
								<Text className="tw-mb-1 tw-font-bold tw-leading-tight">{contact.name}</Text>
								{contactPhone.map((phone) => {
									return (
										<ContactPhone
											key={generateSlug(phone)}
											phone={phone}
											country={contact.country}
										/>
									);
								})}
								<ContactLinks
									contact={contact}
									whatsAppOption={whatsAppOption}
								/>
							</Block>
						);
					})}
				</Block>
			</Collapsible>

			<style jsx>{`
				.root {
					break-before: left;
					page-break-before: left;
				}

				.root :global(.contact-container) {
					break-inside: avoid;
					page-break-inside: avoid;
				}
			`}</style>
		</div>
	);
}

type T_ContactPhoneProps = {
	phone: string;
	country: T_Contact["country"];
};

function ContactPhone({ phone, country }: T_ContactPhoneProps): T_ReactElementNullable {
	// vars
	const COUNTRIES_EMOJIS = {
		AR: "🇦🇷",
		BR: "🇧🇷",
		CA: "🇨🇦",
		CO: "🇨🇴",
		FR: "🇫🇷",
		GB: "🇬🇧",
		ISR: "🇮🇱",
		MX: "🇲🇽",
		PE: "🇵🇪",
		PY: "🇵🇾",
		SP: "🇪🇸",
		USA: "🇺🇲",
		UY: "🇺🇾",
	};
	const phoneWithoutCode = isNotEmptyString(phone) ? phone.split(" ")[1] : "";
	const isPhoneFromColombia = country === "CO";

	if (isEmptyString(phoneWithoutCode)) {
		return null;
	}

	return (
		<Button
			className="tw-mb-1 tw-block tw-text-sm tw-italic dfr-text-color-secondary"
			data-clipboard-text={isPhoneFromColombia ? phoneWithoutCode : phone}
			onClick={handleCopyToClipboardClick}
		>
			<Emoji className="tw-mr-2 tw-not-italic">{COUNTRIES_EMOJIS[country]}</Emoji>
			<InlineText>{isPhoneFromColombia ? formatPhoneNumber(phoneWithoutCode) : phone}</InlineText>
		</Button>
	);
}

function ContactLinks({
	contact,
	whatsAppOption,
}: {
	contact: T_Contact;
	whatsAppOption: T_WhatsAppOption;
}): T_ReactElement {
	return (
		<div className={classNames(styles["ContactLinks"])}>
			{Array.isArray(contact.phone) ? (
				<Block>
					{contact.phone.map((item) => {
						return (
							<WhastAppButton
								key={generateSlug(item.label)}
								phone={item.value}
								whatsAppOption={whatsAppOption}
							>
								<Icon
									icon={Icon.icon.WHATSAPP}
									size={24}
								/>
								<InlineText className="tw-mx-1 tw-text-sm tw-font-bold tw-italic tw-text-green-600 dark:tw-text-green-500">
									{item.label}
								</InlineText>
							</WhastAppButton>
						);
					})}
				</Block>
			) : isNotEmptyString(contact.phone) ? (
				<WhastAppButton
					phone={contact.phone}
					whatsAppOption={whatsAppOption}
				>
					<Icon
						icon={Icon.icon.WHATSAPP}
						size={24}
					/>
				</WhastAppButton>
			) : null}

			{isNotEmptyString(contact.instagram) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={`https://instagram.com/${contact.instagram}`}
					isExternalLink
				>
					<Icon
						icon={Icon.icon.INSTAGRAM}
						size={24}
					/>
				</Link>
			) : null}

			{Array.isArray(contact.phone) ? (
				<Block>
					{contact.phone.map((item) => {
						return (
							<PhoneButton
								key={generateSlug(item.label)}
								phone={item.value}
								country={contact.country}
							>
								<Icon
									icon={Icon.icon.PHONE_SOLID}
									size={24}
									color="tw-text-blue-700 dark:tw-text-blue-500"
								/>
								<InlineText className="tw-mx-1 tw-text-sm tw-font-bold tw-italic tw-text-blue-600 dark:tw-text-blue-500">
									{item.label}
								</InlineText>
							</PhoneButton>
						);
					})}
				</Block>
			) : isNotEmptyString(contact.phone) ? (
				<PhoneButton
					phone={contact.phone}
					country={contact.country}
				>
					<Icon
						icon={Icon.icon.PHONE_SOLID}
						size={24}
						color="tw-text-blue-600 dark:tw-text-blue-500"
					/>
				</PhoneButton>
			) : null}

			{Array.isArray(contact.phone) ? (
				<Block>
					{contact.phone.map((item) => {
						return (
							<SMSButton
								key={generateSlug(item.label)}
								phone={item.value}
								country={contact.country}
							>
								<Icon
									icon={Icon.icon.CHAT_SOLID}
									size={24}
									color="tw-text-red-600 dark:tw-text-red-500"
								/>
								<InlineText className="tw-mx-1 tw-text-sm tw-font-bold tw-italic tw-text-red-600 dark:tw-text-red-500">
									{item.label}
								</InlineText>
							</SMSButton>
						);
					})}
				</Block>
			) : isNotEmptyString(contact.phone) ? (
				<SMSButton
					phone={contact.phone}
					country={contact.country}
				>
					<Icon
						icon={Icon.icon.CHAT_SOLID}
						size={24}
						color="tw-text-red-600 dark:tw-text-red-500"
					/>
				</SMSButton>
			) : null}
		</div>
	);
}

type T_WhastAppButtonProps = {
	children: T_ReactChildren;
	phone: string;
	whatsAppOption: T_WhatsAppOption;
};

function WhastAppButton({
	children,
	phone,
	whatsAppOption,
}: T_WhastAppButtonProps): T_ReactElementNullable {
	// vars
	const isColombianHomePhoneNumber = phone.split(" ")[1]?.startsWith("606");
	const isAssistanceServiceNumber = phone.split(" ")[1]?.length === 3;

	// handlers
	function composeWhatsAppUrl(): string {
		const url = new URLSearchParams();
		url.append("phone", phone.replace(" ", "").trim());
		url.append("text", "Hola");

		return `https://${whatsAppOption}.whatsapp.com/send?${url.toString()}`;
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
	children: T_ReactChildren;
	phone: string;
	country: T_Contact["country"];
};

function PhoneButton({ children, phone, country }: T_PhoneButtonProps): T_ReactElementNullable {
	// vars
	const isPhoneNumberFromColombia = country === "CO";

	// utils
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

function SMSButton({ children, phone, country }: T_PhoneButtonProps): T_ReactElementNullable {
	// vars
	const phoneWithoutCountryCode = phone.split(" ").slice(1).join("").trim();
	const isCellphoneNumber =
		phoneWithoutCountryCode.length === 10 && phoneWithoutCountryCode.startsWith("3");
	const isPhoneNumberFromColombia = country === "CO";

	// utils
	function generateSMSLink(): string {
		return `sms:${phoneWithoutCountryCode}&body=Hello`;
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

// --- Utils ---

function countAllContacts(contacts: T_ContactsProps["contacts"]): number {
	const result = Object.values(contacts).reduce((result, groupOfContacts) => {
		return result + countGroupOfContacts(groupOfContacts);
	}, 0);

	return result;
}

function countGroupOfContacts(contacts: T_GroupOfContacts): number {
	if (Array.isArray(contacts)) {
		return contacts.length;
	}

	return Object.values(contacts).reduce(
		(result, groupOfContacts: T_Contact[]) => result + groupOfContacts.length,
		0,
	);
}

// --- Types ---

type T_GroupOfContacts = T_Contact[] | T_Object<T_Contact[]>;

type T_Contact = {
	name: string;
	phone: string | { label: string; value: string }[];
	instagram: string;
	country:
		| "AR"
		| "BR"
		| "CA"
		| "CO"
		| "FR"
		| "GB"
		| "ISR"
		| "MX"
		| "PE"
		| "PY"
		| "SP"
		| "USA"
		| "UY";
};

type T_WhatsAppOption = "api" | "web";
