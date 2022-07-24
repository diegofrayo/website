import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import type { T_HTMLElementAttributes, T_ReactChildren, T_ReactElement } from "~/types";

import Icon from "./Icon";
import Link from "./Link";
import { isString } from "~/utils/validations";

const VARIANTS_OPTIONS = ["UNSTYLED", "PRIMARY", "SECONDARY"] as const;
const VARIANTS = mirror<T_Variant>(VARIANTS_OPTIONS);
type T_Variant = typeof VARIANTS_OPTIONS[number];
const SIZES_OPTIONS = ["XS", "SM", "MD", "LG", "XL"] as const;
const SIZES = mirror<T_Size>(SIZES_OPTIONS);
type T_Size = typeof SIZES_OPTIONS[number];

type T_TitleProps = {
	children: T_ReactChildren;
	is: "h1" | "h2" | "h3" | "h4";
	variant?: T_Variant;
	size?: T_Size;
	showLinkIcon?: boolean;
} & T_HTMLElementAttributes["h1"];

function Title(props: T_TitleProps): T_ReactElement {
	const {
		// props
		variant,
		showLinkIcon,
		children,
		is: Tag,

		// vars
		id,
		className,

		...rest
	} = useController(props);

	if (variant === VARIANTS.PRIMARY && showLinkIcon) {
		return (
			<Tag
				id={id}
				className={className}
				{...rest}
			>
				<Link
					variant={Link.variant.SIMPLE}
					href={`#${id}`}
					className={classNames(
						"tw-visible tw-float-left tw--ml-5 tw-pr-1 tw-leading-0 sm:tw-invisible",
						{
							h1: "tw-pt-3",
							h2: "tw-pt-2.5",
							h3: "tw-pt-2",
							h4: "tw-pt-1.5",
						}[Tag],
					)}
				>
					<Icon
						icon={Icon.icon.LINK}
						size={16}
					/>
				</Link>
				{children}

				<style jsx>
					{`
						:global(.dfr-Title--primary):hover :global(.dfr-Link) {
							visibility: visible;
						}

						:global(.dfr-Title--primary) {
							scroll-margin-top: 20px;
						}
					`}
				</style>
			</Tag>
		);
	}

	return (
		<Tag
			id={id}
			className={classNames(className)}
			{...rest}
		>
			{children}
		</Tag>
	);
}

Title.variant = VARIANTS;
Title.size = SIZES;

export default Title;
export type { T_TitleProps };

// --- Controller ---

type T_UseControllerReturn = T_TitleProps;

function useController({
	children,
	is,
	className = "",
	size = undefined,
	variant = VARIANTS.PRIMARY,
	showLinkIcon = false,
	id = "",
	...rest
}: T_TitleProps): T_UseControllerReturn {
	// utils
	function generateStyles(tag: T_TitleProps["is"]): string {
		return classNames(
			{
				PRIMARY: classNames(
					"dfr-text-color-bw-inv",
					{
						h1: "tw-text-4xl",
						h2: "tw-text-3xl",
						h3: "tw-text-2xl",
						h4: "tw-text-xl",
					}[tag],
				),
				SECONDARY: "dfr-text-color-bw-inv",
				UNSTYLED: "",
			}[variant],
			isString(size) &&
				{
					XS: "tw-text-md",
					SM: "tw-text-xl",
					MD: "tw-text-2xl",
					LG: "tw-text-3xl",
					XL: "tw-text-4xl",
				}[size],
		);
	}

	return {
		// props
		variant,
		showLinkIcon,
		children,
		is,
		...rest,

		// vars
		id: variant === VARIANTS.PRIMARY && isString(children) ? generateSlug(children) : id,
		className: classNames(
			`dfr-Title dfr-Title--${variant.toLowerCase()}`,
			"tw-font-bold tw-font-sans",
			generateStyles(is),
			className,
		),
	};
}
