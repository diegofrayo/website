import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import type { T_PageProps } from "~/components/layout/Page";
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
import { BoxWithTitle, CopyToClipboardPopover } from "~/components/shared";
import { withOnlyClientRender } from "~/hocs";
import { withAuthRulesPage } from "~/modules/auth";
import { useDidMount, useEnhancedState } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import { isBusiness, type T_Business } from "@diegofrayo/types/businesses";
import { isContact, type T_Contact } from "@diegofrayo/types/contacts";
import { isMobileDevice } from "@diegofrayo/utils/browser";
import { throwError } from "@diegofrayo/utils/misc";
import { capitalize, generateSlug, replaceAll } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

import {
	type T_BusinessesPageProps,
	type T_ContactsPageProps,
	type T_WhatsAppLinksMode,
} from "../types";
import { countContacts, formatPhoneNumber, parseCategoryName } from "../utils";

export function Output({ children }: { children: string }) {
	return (
		<output className="tw-block tw-min-h-[40px] tw-w-full tw-whitespace-break-spaces tw-break-all tw-border tw-p-3 tw-font-mono tw-text-sm dr-border-color-surface-300">
			{children}
		</output>
	);
}

type T_ContactsPageComponentProps = {
	config: T_PageProps["config"];
	data: (T_ContactsPageProps | T_BusinessesPageProps)["data"];
	variant: "businesses" | "contacts";
};

export const ContactsPage = withAuthRulesPage(
	withOnlyClientRender(function ContactsPage({
		config,
		data,
		variant,
	}: T_ContactsPageComponentProps) {
		// --- HOOKS ---
		const [isAllCollapsiblesOpened, , toggleIsAllCollapsiblesOpened] = useEnhancedState(false);

		// --- STATES & REFS ---
		const [whatsAppLinksMode, setWhatsAppLinksMode] = React.useState<T_WhatsAppLinksMode>("web");

		// --- EFFECTS ---
		useDidMount(() => {
			setWhatsAppLinksMode(isMobileDevice() ? "app" : "web");
		});

		// --- HANDLERS ---
		function handleToggleAllCollapsiblesOpenedClick() {
			toggleIsAllCollapsiblesOpened();
		}

		function handleToggleWhatsAppLinksModeClick() {
			setWhatsAppLinksMode(whatsAppLinksMode === "app" ? "web" : "app");
		}

		function handleDownloadAsHTMLClick() {
			const content = generateContactsListAsText("", data);
			const text = replaceAll(
				replaceAll(HTML_CONTACTS_PAGE, "{CONTENT}", content),
				"{TITLE}",
				capitalize(variant),
			);

			const element = document.createElement("a");
			element.setAttribute("href", `data:html/plain;charset=utf-8,${encodeURIComponent(text)}`);
			element.setAttribute("download", `${variant}.html`);
			element.style.display = "none";

			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		}

		// --- UTILS ---
		function generateContactsListAsText(contactsGroupTitle: string, contacts: unknown): string {
			if (v.isArray<T_Contact>(contacts)) {
				return `
          <details style="margin-bottom: 20px;">
            <summary style="cursor: pointer">${contactsGroupTitle}</summary>
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: space-between;
                padding-left: 20px;
                padding-top: 10px;
              "
            >
              ${contacts
								.map((contact) => {
									const phone = v.isArray(contact.phone) ? contact.phone[0].value : contact.phone;
									const [phoneCountryCode, phoneWithoutCode] = v.isNotEmptyString(phone)
										? phone.split(" ")
										: ["", ""];
									const formattedPhone = formatPhoneNumber(phoneWithoutCode, phoneCountryCode);

									return `
                    <div style="width: 48%;">
                      <p style="font-weight: bold">${contact.name}</p>
                      <hr class="separator" style="margin: 2px auto" />

                      ${
												phone
													? `
                      <p style="font-style: italic; font-size: 0.8rem">
                        ${formattedPhone}
                      </p>
                      <hr class="separator" style="margin: 3px auto" />
                            `
													: ""
											}

                      <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${
													phone
														? `
                        <a class="cta-link" href="tel:${phoneWithoutCode}" target="_blank"
                          >📞 Llamar</a
                        >
                        <a
                          class="cta-link"
                          href="https://api.whatsapp.com/send?phone=${encodeURIComponent(
														phone.replace(" ", "").trim(),
													)}"
                          target="_blank"
                          >📝 WhatsApp</a
                        >`
														: ""
												}

                        ${
													contact.instagram
														? `
                        <a class="cta-link" href="https://instagram.com/${contact.instagram}" target="_blank">
                          📸 Instagram
                        </a>
                        `
														: ""
												}

                        ${
													isBusiness(contact) && contact.maps
														? `
                        <a class="cta-link" href="${contact.maps}" target="_blank">
                        📍 Maps
                        </a>
                        `
														: ""
												}

                        ${
													isBusiness(contact) && contact.menu
														? `
                        <a class="cta-link" href="${contact.menu}" target="_blank">
                        📝 Menu
                        </a>
                        `
														: ""
												}
                      </div>
                    </div>
                  `;
								})
								.join("\n")}
            </div>
          </details>
        `;
			}

			if (v.isObject(contacts)) {
				return Object.entries(contacts)
					.map(([subCategoryName, subCategoryContacts]: [string, unknown]) => {
						return generateContactsListAsText(
							`${contactsGroupTitle ? `${contactsGroupTitle} / ` : ""}${
								subCategoryName.match(/^\d/) ? subCategoryName.substring(2) : subCategoryName
							}`,
							subCategoryContacts,
						);
					})
					.join("\n");
			}

			return "";
		}

		return (
			<Page config={config}>
				<MainLayout title={config.title || ""}>
					<BoxWithTitle
						title="Configuración"
						className="tw-flex tw-px-2 tw-pb-4 tw-pt-5"
					>
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

							<Button
								variant={Button.variant.STYLED}
								onClick={handleDownloadAsHTMLClick}
							>
								<Icon icon={Icon.icon.ARROW_DOWN_TRAY} />
							</Button>
						</Block>
					</BoxWithTitle>

					<Space size={4} />

					<Contacts
						title={config.title || ""}
						contacts={data}
						whatsAppLinksMode={whatsAppLinksMode}
						isAllCollapsiblesOpened={isAllCollapsiblesOpened}
					/>
				</MainLayout>
			</Page>
		);
	}),
	{
		requireAuth: true,
		requirePin: true,
	},
);

// --- INTERNALS ---

type T_Contacts = {
	title: string;
	contacts: T_ContactsPageProps["data"] | T_BusinessesPageProps["data"];
	whatsAppLinksMode: T_WhatsAppLinksMode;
	isAllCollapsiblesOpened: boolean;
};

function Contacts({ title, contacts, whatsAppLinksMode, isAllCollapsiblesOpened }: T_Contacts) {
	return (
		<CategoryContacts
			categoryName={title}
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

			{isContact(contact) ? (
				v.isArray(contact.phone) ? (
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
				) : null
			) : null}

			{v.isNotEmptyString(contact.email) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={`mailto:${contact.email}`}
				>
					<Icon icon={Icon.icon.GMAIL} />
				</Link>
			) : null}

			{isBusiness(contact) && v.isNotEmptyString(contact.maps) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={contact.maps}
					isExternalLink
				>
					<Icon
						icon={Icon.icon.MAPS}
						size={24}
					/>
				</Link>
			) : null}

			{isBusiness(contact) && v.isNotEmptyString(contact.menu) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={contact.menu}
					isExternalLink
				>
					<Icon icon={Icon.icon.RESTAURANT_MENU} />
				</Link>
			) : null}
		</Block>
	);
}

type T_PhoneButtonProps = {
	children: DR.React.Children;
	phone: string;
	country: (T_Contact | T_Business)["country"];
};

function PhoneButton({ children, phone, country }: T_PhoneButtonProps) {
	// --- VARS ---
	const isPhoneNumberFromColombia = country === "CO";

	// --- UTILS ---
	function generatePhoneLink() {
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
	function composeWhatsAppUrl() {
		const url = new URLSearchParams();
		url.append("phone", phone.replace(" ", "").trim());

		if (whatsAppLinksMode === "web") {
			url.append("text", "Hola!");
		}

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

function SMSButton({ children, phone, country }: T_PhoneButtonProps) {
	// --- VARS ---
	const phoneWithoutCountryCode = phone.split(" ").slice(1).join("").trim();
	const isCellphoneNumber =
		phoneWithoutCountryCode.length === 10 && phoneWithoutCountryCode.startsWith("3");
	const isPhoneNumberFromColombia = country === "CO";

	// --- UTILS ---
	function generateSMSLink() {
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

const HTML_CONTACTS_PAGE = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{TITLE}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        background-color: rgb(200, 200, 200);
        font-family: "Roboto", sans-serif;
        font-size: 18px;
        padding: 20px;
      }

      .cta-link {
        background-color: rgb(6, 145, 1);
        border-radius: 5px;
        color: white;
        display: inline-block;
        font-size: 0.7rem;
        padding: 5px 10px;
        text-decoration: none;
        transition: all 500ms;
      }

      .cta-link:hover {
        opacity: 0.8;
      }

      .separator {
        background-color: transparent;
        border: 0;
      }
    </style>
    <body>
      <main
        style="
          -moz-box-shadow: 0px 0px 5px 0px rgba(138, 138, 138, 1);
          -webkit-box-shadow: 0px 0px 5px 0px rgba(138, 138, 138, 1);
          box-shadow: 0px 0px 5px 0px rgba(138, 138, 138, 1);

          background-color: white;
          border-radius: 20px;
          margin: 0 auto;
          max-width: 100%;
          padding: 20px;
          width: 640px;
        "
      >
        <h1 style="text-align: center">{TITLE}</h1>
        <hr class="separator" style="margin: 20px auto" />

        <div>
          {CONTENT}
        </div>
      </main>
    </body>
  </html>
`;
