import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Button, Collapsible, Icon, InlineText, Link, List, Text } from "~/components/primitive";
import type { T_Object, T_ReactElement } from "~/types";
import { copyToClipboard, isMobile } from "~/utils/browser";
import { formatPhoneNumber } from "~/utils/misc";
import { generateSlug } from "~/utils/strings";

function Contacts({ contacts }: T_ContactsProps): T_ReactElement {
  const PAGE_TITLE = "Contacts";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={`${PAGE_TITLE}`}>
        {Object.entries(contacts).map(([groupName, groupData]: [string, T_Contacts]) => {
          const parsedGroupName = groupName.split("-").slice(1).join("-");

          if (Array.isArray(groupData)) {
            return (
              <ContactsGroup
                key={generateSlug(groupName)}
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
              {Object.entries(groupData).map(([groupName, contacts]: [string, T_Contact[]]) => {
                const parsedGroupName = groupName.split("-").slice(1).join("-");

                return (
                  <ContactsGroup
                    key={generateSlug(groupName)}
                    groupName={parsedGroupName}
                    contacts={contacts}
                  />
                );
              })}
            </Collapsible>
          );
        })}
      </MainLayout>
    </Page>
  );
}

export default Contacts;

// --- Components ---

function ContactsGroup({ groupName, contacts }): T_ReactElement {
  return (
    <Collapsible
      title={`❏ ${groupName} [${countContacts(contacts)}]`}
      className="tw-mb-8 last:tw-mb-0"
    >
      <List variant={List.variant.DEFAULT}>
        {contacts.map((contact) => {
          const phoneWithoutCode =
            typeof contact.phone === "string" ? contact.phone.split(" ")[1] : "";
          const isPhoneFromColombia = contact.country === "CO";

          return (
            <List.Item
              key={generateSlug(contact.name)}
              className="tw-pb-4 tw-font-bold"
            >
              <Text className="tw-leading-tight">{contact.name}</Text>
              {phoneWithoutCode ? (
                <Button
                  className="tw-mb-1 tw-text-sm tw-italic dfr-text-color-secondary"
                  data-clipboard-text={isPhoneFromColombia ? phoneWithoutCode : contact.phone}
                  onClick={copyToClipboard}
                >
                  {isPhoneFromColombia ? formatPhoneNumber(phoneWithoutCode) : contact.phone}
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

function ContactLinks({ contact }: { contact: T_Contact }) {
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
      ) : contact.phone ? (
        <WhastAppButton phone={contact.phone}>
          <Icon
            icon={Icon.icon.WHATSAPP}
            size={24}
          />
        </WhastAppButton>
      ) : null}

      {contact.instagram ? (
        <Link
          variant={Link.variant.SIMPLE}
          href={`https://instagram.com/${contact.instagram}`}
          isExternalUrl
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

      <style jsx>{`
        .root > :global(*) {
          @apply tw-mr-2;
          display: inline-block;
        }

        .root > :global(*):last-child {
          @apply tw-mr-0;
        }
      `}</style>
    </div>
  );
}

function WhastAppButton({ children, phone }) {
  function handleWhatsAppClick(phone: string) {
    return () => {
      const url = `https://${isMobile() ? "api" : "web"}.whatsapp.com/send?phone=${phone.replace(
        " ",
        "",
      )}`.trim();

      window.open(url);
    };
  }

  const isColombianHomePhoneNumber = phone.split(" ")[1]?.startsWith("60");
  if (isColombianHomePhoneNumber) {
    return null;
  }

  return (
    <Button
      variant={Button.variant.SIMPLE}
      onClick={handleWhatsAppClick(phone)}
    >
      {children}
    </Button>
  );
}

function PhoneButton({ children, phone, country }) {
  function generatePhoneLink(phone: string) {
    return `tel:${phone.split(" ").slice(1).join("").trim()}`;
  }

  const isPhoneNumberFromColombia = country === "CO";
  if (!isPhoneNumberFromColombia) return null;

  return (
    <Link
      variant={Link.variant.SIMPLE}
      href={generatePhoneLink(phone)}
      isExternalUrl
    >
      {children}
    </Link>
  );
}

// --- Utils ---

function countContacts(contacts: T_Contacts) {
  if (Array.isArray(contacts)) return contacts.length;

  return Object.values(contacts).reduce((result, contacts) => {
    return result + (contacts.length as number);
  }, 0);
}

// --- Types ---

type T_ContactsProps = {
  contacts: {
    contacts: T_Contacts;
  };
};

type T_Contacts = T_Object<T_Contact[] | T_Object<T_Contact[]>>;

type T_Contact = {
  name: string;
  phone: string | { label: string; value: string }[];
  instagram: string;
  group: string;
  country: "CO" | "USA" | "AR" | "PE" | "UY" | "PY" | "CA" | "ISR" | "MX" | "FR" | "SP" | "BR";
};
