import * as React from "react";
import ReactMarkdown from "react-markdown";

import { List } from "~/@legacy/src/components/primitive";
import { MDXComponents } from "~/@legacy/src/features/mdx";
import { omit, pick } from "~/@legacy/src/utils/objects-and-arrays";

import styles from "~/@legacy/src/styles/markdown.module.css";
import type { T_Object, T_ReactChildren, T_ReactElement } from "~/@legacy/src/types";

function MarkdownContent({ content }: { content: string }): T_ReactElement {
	// DOCS: https://github.com/remarkjs/react-markdown#appendix-b-components
	const MDComponents = {
		...pick(MDXComponents, ["a", "code", "h1", "h2", "h3", "h4", "img", "pre", "ul", "li"]),
		li: Li,
	};

	return (
		<ReactMarkdown
			className={styles["dfr-MarkdownContent--default"]}
			components={MDComponents}
		>
			{content}
		</ReactMarkdown>
	);
}

export default MarkdownContent;

// --- Components ---

function Li({ children, ...rest }: { children: T_ReactChildren }): T_ReactElement {
	return (
		<List.Item {...omit(rest as T_Object, ["node", "ordered", "checked"])}>{children}</List.Item>
	);
}
