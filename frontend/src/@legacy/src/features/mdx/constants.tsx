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
} from "~/@legacy/src/components/primitive";
import {
	ImageWithLink,
	Playground,
	ProtectedComponent,
	SourceCode,
	Timeline,
	TitleCreator,
} from "~/@legacy/src/components/shared";
import { ENV_VARS } from "~/@legacy/src/constants";
import AboutMeBlock from "~/@legacy/src/features/pages/about-me/components";
import * as BlogComponents from "~/@legacy/src/features/pages/blog/components";
import * as MusicComponents from "~/@legacy/src/features/pages/music/components";
import * as ResumeComponents from "~/@legacy/src/features/pages/resume";
import { ROUTES } from "~/@legacy/src/features/routing";
import { T_Metadata } from "~/@legacy/src/stores/modules/metadata";
import type { T_ReactChildren, T_ReactElement, T_ReactFunctionComponent } from "~/@legacy/src/types";

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
	code: ((): T_ReactFunctionComponent<{ children: T_ReactChildren }> => {
		function InnerInlineCode({ children }: { children: T_ReactChildren }): T_ReactElement {
			return <Code>{children}</Code>;
		}

		InnerInlineCode.customName = "InlineCode";

		return InnerInlineCode;
	})(),
	h1: TitleCreator("h1", { showLinkIcon: true }),
	h2: TitleCreator("h2", { showLinkIcon: true }),
	h3: TitleCreator("h3", { showLinkIcon: true }),
	h4: TitleCreator("h4", { showLinkIcon: true }),
	hr: function HR(): T_ReactElement {
		return <Space variant={Space.variant.DASHED} />;
	},
	img: Image,
	pre: function CustomPre({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <Pre variant={Pre.variant.STYLED}>{children}</Pre>;
	},
	ul: function Ul({ children }: { children: T_ReactChildren }): T_ReactElement {
		return <List variant={List.variant.DEFAULT}>{children}</List>;
	},
	li: List.Item,

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
