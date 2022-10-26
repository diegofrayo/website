import * as React from "react";

import {
	Block,
	Code,
	Collapsible,
	Icon,
	Image,
	Link,
	List,
	Pre,
	Space,
	Text,
} from "~/components/primitive";
import {
	ImageWithLink,
	Playground,
	ProtectedComponent,
	SourceCode,
	Timeline,
	TitleCreator,
} from "~/components/shared";
import { ENV_VARS } from "~/constants";
import AboutMeBlock from "~/features/pages/about-me/components";
import * as BlogComponents from "~/features/pages/blog/components";
import * as MusicComponents from "~/features/pages/music/components";
import * as ResumeComponents from "~/features/pages/resume";
import { ROUTES } from "~/features/routing";
import { T_Metadata } from "~/stores/modules/metadata";
import type { T_ReactChildren, T_ReactElement } from "~/types";

let MDXScope: {
	DATA: {
		ROUTES: typeof ROUTES;
		SERVER_URL: string;
		PERSONAL_INFO: T_Metadata["website"] | undefined;
	};
} = {
	DATA: {
		ROUTES,
		SERVER_URL: ENV_VARS.NEXT_PUBLIC_ASSETS_SERVER_URL,
		PERSONAL_INFO: undefined,
	},
};

export function getMDXScope(): typeof MDXScope {
	return MDXScope;
}

export function updateMDXScope(PERSONAL_INFO: T_Metadata["website"]): void {
	MDXScope = {
		DATA: {
			...MDXScope.DATA,
			PERSONAL_INFO,
		},
	};
}

// DOCS: https://mdxjs.com/table-of-components/
/* WARN:
 * I don't know how to type this object, so, I used any for this
 * It is not important to solve this
 */
// @ts-ignore
export const MDXComponents = {
	a: function A({ children, href }: { children: T_ReactChildren; href: string }): T_ReactElement {
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
	h1: TitleCreator("h1", { showLinkIcon: true }),
	h2: TitleCreator("h2", { showLinkIcon: true }),
	h3: TitleCreator("h3", { showLinkIcon: true }),
	h4: TitleCreator("h4", { showLinkIcon: true }),
	img: Image,
	ul: function Ul({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <List variant={List.variant.DEFAULT}>{children}</List>;
	},
	li: function Li({ children, ...rest }: { children: T_ReactChildren }): T_ReactElement {
		return <List.Item {...rest}>{children}</List.Item>;
	},
	pre: function CustomPre({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <Pre variant={Pre.variant.STYLED}>{children}</Pre>;
	},
	code: function InlineCode({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <Code>{children}</Code>;
	},
	hr: function HR(): T_ReactElement {
		return <Space variant={Space.variant.DASHED} />;
	},
	blockquote: function Blockquote({ children }: { children: T_ReactChildren }): T_ReactElement {
		return (
			<Block
				is="blockquote"
				variant="QUOTE"
			>
				{children}
			</Block>
		);
	},

	// Primitive components
	Block,
	Collapsible,
	Icon,
	Image,
	Link,
	List,
	Space,
	Text,

	// Shared components
	ImageWithLink,
	Playground,
	ProtectedComponent,
	SourceCode,
	Timeline,

	// Pages components
	...BlogComponents,
	...MusicComponents,
	...ResumeComponents,
	AboutMeBlock,
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
