import { useMemo } from "react";
import { getMDXComponent, getMDXExport } from "mdx-bundler/client";

import cn from "@diegofrayo-pkg/cn";
import type DR from "@diegofrayo-pkg/types";
import { isString } from "@diegofrayo-pkg/validator";
import { WithAuth } from "@diegofrayo-features/auth";
import {
	Box,
	Boxquote,
	Code,
	Collapsible,
	Icon,
	Image,
	InlineText,
	Link,
	List,
	Space,
	Text,
	Title,
	type TitleProps,
} from "@diegofrayo-features/components/primitive";
import { BoxWithTitle, ImageWithLink, SourceCode } from "@diegofrayo-features/components/shared";

import styles from "./styles.module.css";

type MDXContentProps = {
	code: string;
	components?: DR.Object;
	globals?: DR.Object;
};

export function MDXContent({ code, components = {}, globals = {} }: MDXContentProps) {
	const Component = useMemo(() => getMDXComponent(code, globals), [code, globals]);

	return (
		<Box className={cn("dr-mdx-content", styles["dr-mdx-content"])}>
			{/* eslint-disable-next-line react-hooks/static-components */}
			<Component components={{ ...MDXComponents, ...components }} />
		</Box>
	);
}

export { getMDXExport };

// DOCS: https://mdxjs.com/table-of-components
export const MDXComponents = {
	// --- PRIMITIVE COMPONENTS ---
	a: function CustomA({ children, href }: DR.DOM.HTMLElementAttributes["a"]) {
		return (
			<Link
				href={href || ""}
				variant={Link.variant.STYLED}
				isExternalLink
			>
				{children}
			</Link>
		);
	},
	blockquote: Boxquote,
	code: function CustomCode({ children }: DR.DOM.HTMLElementAttributes["code"]) {
		if (isString(children)) {
			return <Code variant={Code.variant.ENHANCED}>{children}</Code>;
		}

		throw new Error("Code component: Invalid children");
	},
	h1: createTitleComponent("h1", { className: "text-3xl md:text-5xl" }),
	h2: createTitleComponent("h2", { className: "text-2xl md:text-4xl" }),
	h3: createTitleComponent("h3", { className: "text-xl md:text-3xl" }),
	h4: createTitleComponent("h4", { className: "text-lg md:text-2xl" }),
	hr: function CustomHr() {
		return <Space variant={Space.variant.DASHED} />;
	},
	img: function CustomImage(props: DR.DOM.HTMLElementAttributes["img"]) {
		return (
			<Image
				{...props}
				alt={props.alt || ""}
				className="shadow-md shadow-zinc-900"
				useNativeElement
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
	Box,
	BoxWithTitle,
	Collapsible,
	Icon,
	Image,
	ImageWithLink,
	InlineText,
	Link,
	SourceCode,
	Space,
	WithAuth,
};

// --- UTILS ---

function createTitleComponent(Tag: "h1" | "h2" | "h3" | "h4", props: Omit<TitleProps, "as">) {
	return function CustomTitle({ children }: DR.DOM.HTMLElementAttributes["h1"]) {
		return (
			<Title
				{...props}
				as={Tag}
				variant={Title.variant.STYLED}
			>
				{children}
			</Title>
		);
	};
}
