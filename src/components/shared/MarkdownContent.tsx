import * as React from "react";
import ReactMarkdown from "react-markdown";

import { Code, Link, List } from "~/components/primitive";
import type { T_HTMLElementAttributes, T_ReactChildren, T_ReactElement } from "~/types";

import TitleCreator from "./TitleCreator";

function MarkdownContent({ content }: { content: string }): T_ReactElement {
	return <ReactMarkdown components={MDComponents}>{content}</ReactMarkdown>;
}

export default MarkdownContent;

// --- Utils ---

// DOCS: https://github.com/remarkjs/react-markdown#appendix-b-components
const MDComponents = {
	a: function A({ children, href = "" }: T_HTMLElementAttributes["a"]): T_ReactElement {
		return (
			<Link
				href={href}
				variant={Link.variant.PRIMARY}
				isExternalLink
			>
				{children}
			</Link>
		);
	},
	code: function InlineCode({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <Code variant={Code.variant.MARKDOWN}>{children}</Code>;
	},
	h1: TitleCreator("h1", { showLinkIcon: true }),
	h2: TitleCreator("h2", { showLinkIcon: true }),
	h3: TitleCreator("h3", { showLinkIcon: true }),
	h4: TitleCreator("h4", { showLinkIcon: true }),
	li: function Li({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <List.Item>{children}</List.Item>;
	},
	ul: function Ul({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <List variant={List.variant.DEFAULT}>{children}</List>;
	},
};
