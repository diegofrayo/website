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
import { isBusiness, type T_Business, type T_BusinessesData } from "@diegofrayo/types/businesses";
import { isMobileDevice } from "@diegofrayo/utils/browser";
import { throwError } from "@diegofrayo/utils/misc";
import { generateSlug } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";
import type DR from "@diegofrayo/types";

export type T_BusinessesPageProps = {
	data: T_BusinessesData;
};

function BusinessesPage({ data: businesses }: T_BusinessesPageProps) {
	// --- HOOKS ---
	const [isAllCollapsiblesOpened, , toggleIsAllCollapsiblesOpened] = useEnhancedState(false);

	// --- STATES & REFS ---
	const [whatsAppLinksMode, setWhatsAppLinksMode] = React.useState<T_WhatsAppLinksMode>("web");

	// --- VARS ---
	const PAGE_TITLE = "Negocios";

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

				<Businesses
					businesses={businesses}
					whatsAppLinksMode={whatsAppLinksMode}
					isAllCollapsiblesOpened={isAllCollapsiblesOpened}
				/>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(withOnlyClientRender(BusinessesPage), {
	requireAuth: true,
	requirePin: true,
});

// --- COMPONENTS ---

type T_Businesses = {
	businesses: T_BusinessesPageProps["data"];
	whatsAppLinksMode: T_WhatsAppLinksMode;
	isAllCollapsiblesOpened: boolean;
};

function Businesses({ businesses, whatsAppLinksMode, isAllCollapsiblesOpened }: T_Businesses) {
	return (
		<CategoryBusinesses
			categoryName="Negocios"
			businesses={businesses}
			whatsAppLinksMode={whatsAppLinksMode}
			isAllCollapsiblesOpened={isAllCollapsiblesOpened}
		/>
	);
}

type T_CategoryBusinessesProps = {
	categoryName: string;
	businesses: unknown;
	whatsAppLinksMode: T_WhatsAppLinksMode;
	isAllCollapsiblesOpened: boolean;
};

function CategoryBusinesses({
	categoryName,
	businesses,
	whatsAppLinksMode,
	isAllCollapsiblesOpened,
}: T_CategoryBusinessesProps) {
	return (
		<Block
			className="tw-mt-4"
			style={{ breakBefore: "left", pageBreakBefore: "left" }}
		>
			<Collapsible
				title={`${categoryName} [${countBusinesses(businesses)}]`}
				opened={isAllCollapsiblesOpened}
			>
				{v.isArray<T_Business>(businesses) ? (
					<Block className="tw-flex tw-flex-wrap tw-pt-4">
						{businesses.map((business) => {
							const businessPhone = v.isArray(business.phone)
								? business.phone.map((i) => i.value)
								: [business.phone];

							return (
								<Block
									key={generateSlug(categoryName + business.name)}
									className="tw-mb-8 tw-w-full tw-pr-4 last:tw-mb-4 sm:tw-w-1/2"
									style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
								>
									<Text className="tw-mb-1 tw-font-bold tw-leading-tight">{business.name}</Text>
									<Block>
										{businessPhone.map((phone) => {
											return (
												<BusinessPhone
													key={generateSlug(business.name + phone)}
													phone={phone}
													country={business.country}
												/>
											);
										})}
									</Block>
									<BusinessLinks
										business={business}
										whatsAppLinksMode={whatsAppLinksMode}
									/>
								</Block>
							);
						})}
					</Block>
				) : v.isObject(businesses) ? (
					Object.entries(businesses).map(([subCategoryName, subCategoryBusinesses], index) => {
						return (
							<CategoryBusinesses
								key={generateSlug(`CategoryBusinesses-${subCategoryName}-${index}`)}
								categoryName={parseCategoryName(subCategoryName)}
								businesses={subCategoryBusinesses}
								whatsAppLinksMode={whatsAppLinksMode}
								isAllCollapsiblesOpened={isAllCollapsiblesOpened}
							/>
						);
					})
				) : (
					throwError(`Invalid businesses prop: "${typeof businesses}"`)
				)}
			</Collapsible>
		</Block>
	);
}

type T_BusinessPhoneProps = {
	phone: string;
	country: T_Business["country"];
};

function BusinessPhone({ phone, country }: T_BusinessPhoneProps) {
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

function BusinessLinks({
	business,
	whatsAppLinksMode,
}: {
	business: T_Business;
	whatsAppLinksMode: T_WhatsAppLinksMode;
}) {
	return (
		<Block className="tw-flex tw-flex-wrap tw-gap-x-3 tw-gap-y-1">
			{v.isArray(business.phone) ? (
				<Block className="tw-flex tw-w-full tw-flex-wrap tw-gap-3">
					{business.phone.map((item) => {
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
			) : v.isNotEmptyString(business.phone) ? (
				<WhastAppButton
					phone={business.phone}
					whatsAppLinksMode={whatsAppLinksMode}
				>
					<Icon
						icon={Icon.icon.WHATSAPP}
						size={24}
					/>
				</WhastAppButton>
			) : null}

			{v.isNotEmptyString(business.instagram) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={`https://instagram.com/${business.instagram}`}
					className="tw-inline-block"
					isExternalLink
				>
					<Icon
						icon={Icon.icon.INSTAGRAM}
						size={24}
					/>
				</Link>
			) : null}

			{v.isArray(business.phone) ? (
				<Block className="tw-flex tw-w-full tw-flex-wrap tw-gap-3">
					{business.phone.map((item) => {
						return (
							<PhoneButton
								key={generateSlug(item.label)}
								phone={item.value}
								country={business.country}
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
			) : v.isNotEmptyString(business.phone) ? (
				<PhoneButton
					phone={business.phone}
					country={business.country}
				>
					<Icon
						icon={Icon.icon.PHONE_SOLID}
						size={24}
						color="tw-text-blue-500"
					/>
				</PhoneButton>
			) : null}

			{v.isNotEmptyString(business.maps) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={business.maps}
					isExternalLink
				>
					<Icon
						icon={Icon.icon.MAPS}
						size={24}
					/>
				</Link>
			) : null}

			{v.isNotEmptyString(business.menu) ? (
				<Link
					variant={Link.variant.SIMPLE}
					href={business.menu}
					isExternalLink
				>
					<Icon
						icon={Icon.icon.RESTAURANT_MENU}
						size={16}
					/>
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
	country: T_Business["country"];
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

function countBusinesses(input: unknown): number {
	if (isBusiness(input)) {
		return 1;
	}

	if (v.isArray(input)) {
		return input.length;
	}

	if (v.isObject(input)) {
		return Object.values(input).reduce((result: number, categoryBusinesses) => {
			return result + countBusinesses(categoryBusinesses);
		}, 0);
	}

	throw new Error(`Error counting businesses => Invalid input type: "${typeof input}"`);
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
