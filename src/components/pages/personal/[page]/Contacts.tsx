import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Button, Collapsible, Icon, InlineText, Link, List, Text } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { withAuth } from "~/auth";
import { handleCopyToClipboardClick, isMobile } from "~/utils/browser";
import { formatPhoneNumber } from "~/utils/formatting";
import { generateSlug } from "~/utils/strings";
import { isNotEmptyString, isString } from "~/utils/validations";
import type { T_Object, T_ReactChildren, T_ReactElement, T_ReactElementNullable } from "~/types";

type T_ContactsProps = {
  contacts: T_Object<T_GroupOfContacts>;
};

function Contacts({ contacts }: T_ContactsProps): T_ReactElement {
  // vars
  const PAGE_TITLE = "Contacts";

  // render
  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={`${PAGE_TITLE}`}>
        {Object.entries(contacts).map(([groupName, groupData]: [string, T_GroupOfContacts]) => {
          const parsedGroupName = groupName.split("-").slice(1).join("-");

          if (Array.isArray(groupData)) {
            return (
              <ContactsGroup
                key={generateSlug(parsedGroupName)}
                groupName={parsedGroupName}
                contacts={groupData}
              />
            );
          }

          return (
            <Collapsible
              key={generateSlug(groupName)}
              title={`❏ ${parsedGroupName} [${countContacts(groupData)}]`}
              className="tw-mb-8 last:tw-mb-0"
            >
              {Object.entries(groupData).map(
                ([subGroupName, subGroupContacts]: [string, T_Contact[]]) => {
                  const parsedSubGroupName = subGroupName.split("-").slice(1).join("-");

                  return (
                    <ContactsGroup
                      key={generateSlug(parsedSubGroupName)}
                      groupName={parsedSubGroupName}
                      contacts={subGroupContacts}
                    />
                  );
                },
              )}
            </Collapsible>
          );
        })}
      </MainLayout>
    </Page>
  );
}

export default withAuth<T_ContactsProps>(Contacts);

// --- Components ---

type T_ContactsGroupProps = {
  groupName: string;
  contacts: T_Contact[];
};

function ContactsGroup({ groupName, contacts }: T_ContactsGroupProps): T_ReactElement {
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

  // render
  return (
    <Collapsible
      title={`❏ ${groupName} [${countContacts(contacts)}]`}
      className="tw-mb-8 last:tw-mb-0"
    >
      <List variant={List.variant.DEFAULT}>
        {contacts.map((contact) => {
          const phoneWithoutCode = isString(contact.phone) ? contact.phone.split(" ")[1] : "";
          const isPhoneFromColombia = contact.country === "CO";

          return (
            <List.Item
              key={generateSlug(contact.name)}
              className="tw-pb-4 tw-font-bold"
            >
              <Text className="tw-leading-tight">{contact.name}</Text>
              {isNotEmptyString(phoneWithoutCode) ? (
                <Button
                  className="tw-mb-1 tw-text-sm tw-italic dfr-text-color-secondary"
                  data-clipboard-text={isPhoneFromColombia ? phoneWithoutCode : contact.phone}
                  onClick={handleCopyToClipboardClick}
                >
                  <Emoji className="tw-mr-2 tw-not-italic">
                    {COUNTRIES_EMOJIS[contact.country]}
                  </Emoji>
                  <InlineText>
                    {isPhoneFromColombia ? formatPhoneNumber(phoneWithoutCode) : contact.phone}
                  </InlineText>
                </Button>
              ) : null}
              <ContactLinks contact={contact} />
            </List.Item>
          );
        })}
      </List>
    </Collapsible>
  );
}

function ContactLinks({ contact }: { contact: T_Contact }): T_ReactElement {
  return (
    <div className="root">
      {Array.isArray(contact.phone) ? (
        contact.phone.map((item) => {
          return (
            <WhastAppButton
              key={generateSlug(item.label)}
              phone={item.value}
            >
              <Icon
                icon={Icon.icon.WHATSAPP}
                size={24}
              />
              <InlineText className="tw-mx-1 tw-text-sm tw-font-bold tw-italic tw-text-green-500">
                {item.label}
              </InlineText>
            </WhastAppButton>
          );
        })
      ) : isNotEmptyString(contact.phone) ? (
        <WhastAppButton phone={contact.phone}>
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
        contact.phone.map((item) => {
          return (
            <PhoneButton
              key={generateSlug(item.label)}
              phone={item.value}
              country={contact.country}
            >
              <Icon
                icon={Icon.icon.PHONE}
                size={22}
                color="tw-text-blue-700"
              />
              <InlineText className="tw-mx-1 tw-text-sm tw-italic tw-text-blue-700">
                {item.label}
              </InlineText>
            </PhoneButton>
          );
        })
      ) : (
        <PhoneButton
          phone={contact.phone}
          country={contact.country}
        >
          <Icon
            icon={Icon.icon.PHONE}
            size={22}
            color="tw-text-blue-700"
          />
        </PhoneButton>
      )}

      <style jsx>
        {`
          .root > :global(*) {
            @apply tw-mr-2;
            display: inline-block;
          }

          .root > :global(*):last-child {
            @apply tw-mr-0;
          }
        `}
      </style>
    </div>
  );
}

type T_WhastAppButtonProps = {
  children: T_ReactChildren;
  phone: string;
};

function WhastAppButton({ children, phone }: T_WhastAppButtonProps): T_ReactElementNullable {
  // vars
  const isColombianHomePhoneNumber = phone.split(" ")[1]?.startsWith("60");
  const isAssistanceServiceNumber = phone.split(" ")[1]?.length === 3;

  // handlers
  function handleWhatsAppClick(): void {
    const url = new URLSearchParams();
    url.append("phone", phone.replace(" ", "").trim());
    url.append("text", "Hey!");

    window.open(`https://${isMobile() ? "api" : "web"}.whatsapp.com/send?${url.toString()}`);
  }

  // render
  if (isColombianHomePhoneNumber || isAssistanceServiceNumber) {
    return null;
  }

  return (
    <Button
      variant={Button.variant.SIMPLE}
      onClick={handleWhatsAppClick}
    >
      {children}
    </Button>
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

  // render
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

// --- Utils ---

function countContacts(contacts: T_GroupOfContacts): number {
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
