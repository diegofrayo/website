import * as React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import classNames from "classnames";

import { Block } from "~/@legacy/src/components/primitive";
import { MDXComponents } from "~/@legacy/src/features/mdx";
import { mirror } from "~/@legacy/src/utils/objects-and-arrays";

import styles from "~/@legacy/src/styles/markdown.module.css";
import type { T_ReactElement } from "~/@legacy/src/types";

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
