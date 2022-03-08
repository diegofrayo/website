import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Block, InlineText, Link, List, Space, Title } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { isMobileiOS } from "~/utils/browser";
import { isBrowser } from "~/utils/misc";

function Contacts({ contacts }: { contacts: any }): T_ReactElement {
  const PAGE_TITLE = "Contacts";

  // function countContacts(contacts) {
  //   return Object.values(contacts).reduce((result, contacts) => {
  //     return result + contacts.length;
  //   }, 0);
  // }

  //   && !contact.phone.split(" ")[1]?.startsWith("60")

  // https://help.heroku.com/TXYS53YJ/why-is-my-node-js-build-failing-because-of-an-outdated-yarn-lockfile
  // Santiago Trejos

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={`${PAGE_TITLE}`}>
        {Object.entries({
          "Amigos cercanos": contacts["Amigos cercanos"],
          "Más contactos": contacts["Más contactos"],
          Familia: contacts["Familia"],
          "Otros contactos": contacts["Otros contactos"],
          Negocios: contacts["Negocios"],
          "Extranjeros y viajeros": contacts["Extranjeros y viajeros"],
          Archivados: contacts["Archivados"],
        }).map(([groupName, contacts]) => {
          return (
            <Block key={groupName} className="tw-mb-8 last:tw-mb-0">
              <Title is="h2">{`❏ ${groupName} [${contacts.length}]`}</Title>
              <Space size={1} />
              <List variant={List.variant.DEFAULT}>
                {contacts.map((contact) => {
                  if (contact.title) {
                    return (
                      <Title
                        key={contact.title}
                        is="h3"
                        className="tw-mt-8 tw-mb-2 tw--ml-5"
                      >{`⁆ ${contact.title}`}</Title>
                    );
                  }

                  return (
                    <List.Item key={contact.name} className="tw-font-bold">
                      <InlineText>{contact.name}</InlineText> [
                      <Block className="tw-inline-block">
                        {typeof contact.phone === "string" && contact.phone ? (
                          <LinkItem
                            href={`https://${
                              isBrowser() && isMobileiOS() ? "api" : "web"
                            }.whatsapp.com/send?phone=${contact.phone.replace(" ", "")}`.trim()}
                          >
                            WHATSAPP
                          </LinkItem>
                        ) : null}
                        {contact.instagram && (
                          <LinkItem href={`https://instagram.com/${contact.instagram}`}>
                            INSTAGRAM
                          </LinkItem>
                        )}
                        {Array.isArray(contact.phone) ? (
                          contact.phone.map((item) => {
                            if (!item.value.includes("+57")) return null;

                            return (
                              <LinkItem
                                key={"hppp"}
                                href={`tel:${item.value.split(" ").slice(1).join("").trim()}`}
                              >
                                {`LLAMAR${item.label ? ` (${item.label})` : ""}`}
                              </LinkItem>
                            );
                          })
                        ) : contact.phone.includes("+57") ? (
                          <LinkItem
                            key={"hppp"}
                            href={`tel:${contact.phone.split(" ").slice(1).join("").trim()}`}
                          >
                            {`LLAMAR${contact.label ? ` (${contact.label})` : ""}`}
                          </LinkItem>
                        ) : null}
                      </Block>
                      ]
                    </List.Item>
                  );
                })}
              </List>
            </Block>
          );
        })}
      </MainLayout>
    </Page>
  );
}

export default Contacts;

// --- Components ---

function LinkItem({ href, children }) {
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
