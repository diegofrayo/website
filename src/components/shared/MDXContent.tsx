import * as React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import classNames from "classnames";

import { Block } from "~/components/primitive";
import { MDXComponents } from "~/features/mdx";
import { mirror } from "~/utils/objects-and-arrays";

import styles from "~/styles/markdown.module.css";
import type { T_ReactElement } from "~/types";

const VARIANTS = mirror(["DEFAULT", "UNSTYLED"]);
type T_Variants = keyof typeof VARIANTS;

type T_MDXContentProps = {
	content: MDXRemoteSerializeResult;
	variant?: T_Variants;
};

function MDXContent({ content, variant = VARIANTS.DEFAULT }: T_MDXContentProps): T_ReactElement {
	return (
		<Block
			className={classNames(
				"dfr-MarkdownContent",
				variant === VARIANTS.DEFAULT && styles["dfr-MarkdownContent--default"],
			)}
		>
			<MDXRemote
				{...content}
				components={MDXComponents}
			/>
		</Block>
	);
}

MDXContent.variant = VARIANTS;

export default MDXContent;
