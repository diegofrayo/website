import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Collapsible, Link, List, Text } from "~/components/primitive";
import type { T_Object, T_ReactElement } from "~/types";
import { isMobileiOS } from "~/utils/browser";
import { isBrowser } from "~/utils/misc";
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
        {Object.entries(
          contacts.order.reduce((result, curr) => {
            return {
              [curr]: contacts.data[curr],
              ...result,
            };
          }, {}),
        ).map(([groupName, groupData]: [string, T_Contacts]) => {
          if (Array.isArray(groupData)) {
            return (
              <ContactsGroup
                key={generateSlug(groupName)}
                groupName={groupName}
                contacts={groupData}
              />
            );
          }

          return (
            <Collapsible
              key={generateSlug(groupName)}
              title={`❏ ${groupName} [${countContacts(groupData)}]`}
              className="tw-mb-8 last:tw-mb-0"
            >
              {Object.entries(groupData).map(([groupName, contacts]: [string, T_Contact[]]) => {
                return (
                  <ContactsGroup
                    key={generateSlug(groupName)}
                    groupName={groupName}
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
          return (
            <List.Item key={generateSlug(contact.name)} className="tw-font-bold">
              <Text>{contact.name}</Text>
              <ContactLinks contact={contact} />
            </List.Item>
          );
        })}
      </List>
    </Collapsible>
  );
}

function ContactLinks({ contact }: { contact: T_Contact }) {
  function generatePhoneLink(phone: string) {
    return `tel:${phone.split(" ").slice(1).join("").trim()}`;
  }

  function generateWhatsAppLink(phone: string) {
    if (phone.split(" ")[1]?.startsWith("60")) return "";

    return `https://${
      isBrowser() && isMobileiOS() ? "api" : "web"
    }.whatsapp.com/send?phone=${phone.replace(" ", "")}`.trim();
  }

  function isPhoneNumberFromColombia(phone: string) {
    return phone.includes("+57");
  }

  return (
    <div className="root">
      {Array.isArray(contact.phone) ? (
        contact.phone.map((item) => {
          return (
            <ContactLinksItem
              key={generateSlug(item.label)}
              href={generateWhatsAppLink(item.value)}
            >
              {`WHATSAPP (${item.label})`}
            </ContactLinksItem>
          );
        })
      ) : contact.phone ? (
        <ContactLinksItem href={generateWhatsAppLink(contact.phone)}>WHATSAPP</ContactLinksItem>
      ) : null}

      {contact.instagram ? (
        <ContactLinksItem href={`https://instagram.com/${contact.instagram}`}>
          INSTAGRAM
        </ContactLinksItem>
      ) : null}

      {Array.isArray(contact.phone) ? (
        contact.phone.map((item) => {
          if (!isPhoneNumberFromColombia(item.value)) return null;

          return (
            <ContactLinksItem key={generateSlug(item.label)} href={generatePhoneLink(item.value)}>
              {`LLAMAR (${item.label})`}
            </ContactLinksItem>
          );
        })
      ) : isPhoneNumberFromColombia(contact.phone) ? (
        <ContactLinksItem href={generatePhoneLink(contact.phone)}>LLAMAR</ContactLinksItem>
      ) : null}

      <style jsx>{`
        .root::before {
          content: "[";
          display: inline-block;
          margin-right: 3px;
        }

        .root::after {
          content: "]";
          display: inline-block;
          margin-left: 3px;
        }
      `}</style>
    </div>
  );
}

function ContactLinksItem({ href = "", children }) {
  if (!href) return null;

  return (
    <div className="root tw-inline-block">
      <Link variant={Link.variant.PRIMARY} href={href} isExternalUrl>
        {children}
      </Link>

      <style jsx>{`
        .root::after {
          content: "|";
          display: inline-block;
          margin: 0 5px;
        }

        .root:last-child::after {
          display: none;
        }
      `}</style>
    </div>
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
    order: string[];
    data: T_Contacts;
  };
};

type T_Contacts = T_Object<T_Contact[] | T_Object<T_Contact[]>>;

type T_Contact = {
  name: string;
  phone: string | { label: string; value: string }[];
  instagram: string;
  group: string;

  title?: string;
};
