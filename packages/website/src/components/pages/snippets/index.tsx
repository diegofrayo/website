import React from "react";

import { Collapsible, Title, List, Link } from "~/components/primitive";
import { Code } from "~/components/pages/_shared";
import { T_Object, T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

import { T_Snippet } from "./types";

export function TableOfContent({ data }: { data: T_Object<T_Snippet[]> }): T_ReactElement {
  return (
    <div data-markdown-block>
      <Title is="h2" className="tw-mb-6">
        Table of content
      </Title>
      <List>
        {Object.entries(data).map(([category, snippets]) => {
          return (
            <List.Item key={`TableOfContent-${category}`} data-markdown-block>
              <Link href={`#${generateSlug(category)}`}> {category}</Link>
              <List>
                {snippets.map((snippet, index) => {
                  return (
                    <List.Item key={`TableOfContent-${category}-${index}`}>
                      <Link href={`#${generateSlug(snippet.title)}`}>{snippet.title}</Link>
                    </List.Item>
                  );
                })}
              </List>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}

export function Snippets({ data }: { data: T_Object<T_Snippet[]> }): T_ReactElement {
  return (
    <div data-markdown-block>
      {Object.entries(data).map(([category, snippets]) => {
        return (
          <section key={`Snippets-${category}`} data-markdown-block>
            <Title is="h2" className="tw-mb-6" showLinkIcon>
              {category}
            </Title>
            <div>
              {snippets.map((snippet, index) => {
                return (
                  <section key={`Snippets-${category}-${index}`}>
                    <Title is="h3" className="tw-mb-3" showLinkIcon>
                      {snippet.title}
                    </Title>
                    <Collapsible>
                      <Code
                        language={snippet.language}
                        fileName={snippet.title}
                        code={snippet.content}
                      />
                    </Collapsible>
                  </section>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
