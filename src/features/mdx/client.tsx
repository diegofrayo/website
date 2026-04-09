import { useMemo } from "react";
import { getMDXComponent, getMDXExport } from "mdx-bundler/client";

import cn from "@diegofrayo-pkg/cn";
import type UtilsTypes from "@diegofrayo-pkg/types";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { isString } from "@diegofrayo-pkg/validator";

import BoxWithTitle from "~/components/common/box-with-title";
import CopyToClipboardPopover from "~/components/common/copy-to-clipboard-popover";
import ImageWithLink from "~/components/common/image-with-link";
import SourceCode from "~/components/common/source-code";
import {
	BlockQuote,
	Box,
	Button,
	Code,
	Collapsible,
	Icon,
	InlineText,
	Link,
	List,
	Space,
	Text,
	Title,
	type ImageProps,
	type TitleProps,
} from "~/components/primitive";
import { WithAuth } from "~/features/auth";

import styles from "./styles.module.css";

type MDXContentProps = {
	code: string;
	components?: UtilsTypes.Object;
	globals?: UtilsTypes.Object;
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
	a: function CustomA({ children, href }: ReactTypes.DOM.HTMLElementAttributes["a"]) {
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
	blockquote: BlockQuote,
	code: function CustomCode({ children }: ReactTypes.DOM.HTMLElementAttributes["code"]) {
		if (isString(children)) {
			return (
				<CopyToClipboardPopover textToCopy={children}>
					<Button variant={Button.variant.SMOOTH}>
						<Code variant={Code.variant.STYLED}>{children}</Code>
					</Button>
				</CopyToClipboardPopover>
			);
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
	li: List.Item,
	p: Text,
	pre: function CustomPre({ children }: ReactTypes.DOM.HTMLElementAttributes["pre"]) {
		return <SourceCode code={children} />;
	},
	ul: function CustomUl({ children }: ReactTypes.DOM.HTMLElementAttributes["ul"]) {
		return <List variant={List.variant.SIMPLE}>{children}</List>;
	},

	// --- CUSTOM COMPONENTS ---
	Box,
	BoxWithTitle,
	Collapsible,
	Icon,
	InlineText,
	Link,
	MDXImage: (props: ImageProps) => {
		return (
			<ImageWithLink
				className="shadow-md shadow-zinc-900"
				{...props}
			/>
		);
	},
	SourceCode,
	Space,
	WithAuth,
};

// --- UTILS ---

function createTitleComponent(Tag: "h1" | "h2" | "h3" | "h4", props: Omit<TitleProps, "as">) {
	return function CustomTitle({ children }: ReactTypes.DOM.HTMLElementAttributes["h1"]) {
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
