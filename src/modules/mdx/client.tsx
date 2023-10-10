import * as React from "react";
import { getMDXComponent, getMDXExport } from "mdx-bundler/client";
import cn from "classnames";

import {
	Block,
	Blockquote,
	Code,
	Image,
	Link,
	List,
	Space,
	Text,
	Title,
} from "~/components/primitive";
import { SourceCode } from "~/components/shared";
import type { T_TitleProps } from "~/components/primitive/Title";
import type DR from "@diegofrayo/types";

import styles from "./styles.module.css";

type T_MDXContentProps = {
	code: string;
	components?: DR.Object;
	globals?: DR.Object;
};

export function MDXContent({ code, components = {}, globals = {} }: T_MDXContentProps) {
	const Component = React.useMemo(() => getMDXComponent(code, globals), [code, globals]);

	return (
		<Block className={cn("dr-mdx-content", styles["dr-mdx-content"])}>
			<Component components={{ ...MDXComponents, ...components }} />
		</Block>
	);
}

export { getMDXExport };

// DOCS: https://mdxjs.com/table-of-components/
/* WARN:
 * I don't know how to type this object, so, I used any for this
 * It is not important to solve this
 */
// @ts-ignore
export const MDXComponents = {
	// --- PRIMITIVE COMPONENTS ---
	a: function CustomA({ children, href }: DR.DOM.HTMLElementAttributes["a"]) {
		return (
			<Link
				href={href || ""}
				variant={Link.variant.PRIMARY}
				isExternalLink
			>
				{children}
			</Link>
		);
	},
	blockquote: Blockquote,
	code: function CustomCode({ children }: DR.DOM.HTMLElementAttributes["code"]) {
		return <Code variant={Code.variant.STYLED}>{children}</Code>;
	},
	h1: createTitleComponent("h1", {}),
	h2: createTitleComponent("h2", {}),
	h3: createTitleComponent("h3", {}),
	h4: createTitleComponent("h4", {}),
	hr: function CustomHr() {
		return <Space variant={Space.variant.DASHED} />;
	},
	img: function CustomImage(props: DR.DOM.HTMLElementAttributes["img"]) {
		return (
			<Image
				{...props}
				alt={props.alt || ""}
				useNativeImage
			/>
		);
	},
	li: List.Item,
	p: Text,
	pre: function CustomPre({ children }: DR.DOM.HTMLElementAttributes["pre"]) {
		return <SourceCode code={children} />;
	},
	ul: function CustomUl({ children }: DR.DOM.HTMLElementAttributes["ul"]) {
		return <List variant={List.variant.SIMPLE}>{children}</List>;
	},

	// --- CUSTOM COMPONENTS ---
	Block,
	SourceCode,
};

// --- INTERNALS ---

function createTitleComponent(Tag: "h1" | "h2" | "h3" | "h4", props: Omit<T_TitleProps, "is">) {
	return function CustomTitle({ children }: DR.DOM.HTMLElementAttributes["h1"]) {
		return (
			<Title
				{...props}
				is={Tag}
				variant={Title.variant.PRIMARY}
			>
				{children}
			</Title>
		);
	};
}
