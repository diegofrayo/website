import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/@legacy/src/components/layout";
import {
	Block,
	Button,
	Collapsible,
	Icon,
	InlineText,
	Link,
	Space,
	Text,
} from "~/@legacy/src/components/primitive";
import { withAuthPage } from "~/@legacy/src/features/auth";
import { useDidMount, useEnhancedState } from "~/@legacy/src/hooks";
import v from "~/@legacy/src/lib/v";
import { isServer } from "~/@legacy/src/utils/app";
import { handleCopyToClipboardClick } from "~/@legacy/src/utils/browser";
import { formatPhoneNumber } from "~/@legacy/src/utils/formatting";
import { generateSlug } from "~/@legacy/src/utils/strings";
import type {
	T_Object,
	T_ReactChildren,
	T_ReactElement,
	T_ReactElementNullable,
} from "~/@legacy/src/types";

import styles from "./styles.module.css";

type T_BusinessesProps = {
	businesses: T_Object<T_GroupOfBusinesses>;
};

function Businesses({ businesses }: T_BusinessesProps): T_ReactElementNullable {
	// hooks
	const [isAllCollapsibleOpened, setAllCollapsibleOpened, toggleIsAllCollapsibleOpened] =
		useEnhancedState(false);

	// states & refs
	const { current: totalOfBusinesses } = React.useRef<number>(countAllBusinesses(businesses));
	const [whatsAppOption, setWhatsAppOption] = React.useState<T_WhatsAppOption>("api");

	// vars
	const PAGE_TITLE = "Businesses";

	// effects
	useDidMount(() => {
		// NOTE: Disable temporary
		// setWhatsAppOption(isMobileDevice() ? "api" : "web");
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
							<InlineText>{totalOfBusinesses}</InlineText>
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
					{Object.entries(businesses).map(
						([groupName, groupData]: [string, T_GroupOfBusinesses]) => {
							const parsedGroupName = groupName;

							if (Array.isArray(groupData)) {
								return (
									<BusinessesGroup
										key={generateSlug(parsedGroupName)}
										groupName={parsedGroupName}
										businesses={groupData}
										collapsibleOpened={isAllCollapsibleOpened}
										whatsAppOption={whatsAppOption}
									/>
								);
							}

							return (
								<Collapsible
									key={generateSlug(groupName)}
									title={`${parsedGroupName} [${countGroupOfBusinesses(groupData)}]`}
									className="tw-mb-8 last:tw-mb-0"
									opened={isAllCollapsibleOpened}
								>
									{Object.entries(groupData).map(
										([subGroupName, subGroupBusinesses]: [string, T_Business[]]) => {
											const parsedSubGroupName = subGroupName;

											return (
												<BusinessesGroup
													key={generateSlug(parsedSubGroupName)}
													groupName={parsedSubGroupName}
													businesses={subGroupBusinesses}
													collapsibleOpened={isAllCollapsibleOpened}
													whatsAppOption={whatsAppOption}
												/>
											);
										},
									)}
								</Collapsible>
							);
						},
					)}
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthPage<T_BusinessesProps>(Businesses);

// --- Components ---

type T_BusinessesGroupProps = {
	groupName: string;
	businesses: T_Business[];
	collapsibleOpened: boolean;
	whatsAppOption: T_WhatsAppOption;
};

function BusinessesGroup({
	groupName,
	businesses,
	collapsibleOpened,
	whatsAppOption,
}: T_BusinessesGroupProps): T_ReactElement {
	return (
		<div className="root tw-mb-8 last:tw-mb-0">
			<Collapsible
				title={`${groupName} [${countGroupOfBusinesses(businesses)}]`}
				opened={collapsibleOpened}
			>
				<Block className="tw-flex tw-flex-wrap">
					{businesses.map((contact) => {
						if (v.isString(contact)) return null;

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
										<BusinessPhone
											key={generateSlug(phone)}
											phone={phone}
										/>
									);
								})}
								<BusinessLinks
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

type T_BusinessPhoneProps = {
	phone: string;
};

function BusinessPhone({ phone }: T_BusinessPhoneProps): T_ReactElementNullable {
	return (
		<Button
			className="tw-mb-1 tw-block tw-text-sm tw-italic dfr-text-color-secondary"
			data-clipboard-text={phone}
			onClick={handleCopyToClipboardClick}
		>
			<InlineText>{formatPhoneNumber(phone)}</InlineText>
		</Button>
	);
}

function BusinessLinks({
	contact,
	whatsAppOption,
}: {
	contact: T_Business;
	whatsAppOption: T_WhatsAppOption;
}): T_ReactElement {
	return (
		<div className={classNames(styles["BusinessLinks"])}>
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
			) : v.isNotEmptyString(contact.phone) ? (
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

			{v.isNotEmptyString(contact.instagram) ? (
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

			{v.isNotEmptyString(contact.maps) ? (
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

			{Array.isArray(contact.phone) ? (
				<Block>
					{contact.phone.map((item) => {
						return (
							<PhoneButton
								key={generateSlug(item.label)}
								phone={item.value}
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
			) : v.isNotEmptyString(contact.phone) ? (
				<PhoneButton phone={contact.phone}>
					<Icon
						icon={Icon.icon.PHONE_SOLID}
						size={24}
						color="tw-text-blue-600 dark:tw-text-blue-500"
					/>
				</PhoneButton>
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
};

function PhoneButton({ children, phone }: T_PhoneButtonProps): T_ReactElementNullable {
	// utils
	function generatePhoneLink(): string {
		return `tel:${phone.split(" ").slice(1).join("").trim()}`;
	}

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

// --- Utils ---

function countAllBusinesses(businesses: T_BusinessesProps["businesses"]): number {
	const result = Object.values(businesses).reduce((result, groupOfBusinesses) => {
		return result + countGroupOfBusinesses(groupOfBusinesses);
	}, 0);

	return result;
}

function countGroupOfBusinesses(businesses: T_GroupOfBusinesses): number {
	if (Array.isArray(businesses)) {
		return businesses.length;
	}

	return Object.values(businesses).reduce(
		(result, groupOfBusinesses: T_Business[]) => result + groupOfBusinesses.length,
		0,
	);
}

// --- Types ---

type T_GroupOfBusinesses = T_Business[] | T_Object<T_Business[]>;

type T_Business = {
	id: string;
	name: string;
	phone: string | { label: string; value: string }[];
	instagram: string;
	maps: string;
	menu: string;
};

type T_WhatsAppOption = "api" | "web";
