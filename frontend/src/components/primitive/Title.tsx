import * as React from "react";
import classNames from "classnames";

import { mirror } from "~/@diegofrayo/library/utils/objects-and-arrays";
import v from "~/@diegofrayo/library/v";
import { generateSlug } from "~/@diegofrayo/library/utils/strings";
import type {
	T_HTMLElementAttributes,
	T_ReactChildren,
	T_ReactElement,
} from "~/@diegofrayo/library/types/react";

import Icon from "./Icon";
import Link from "./Link";

const VARIANTS = mirror(["UNSTYLED", "PRIMARY", "SECONDARY"]);
type T_Variant = keyof typeof VARIANTS;
const SIZES = mirror(["XS", "SM", "MD", "LG", "XL"]);
type T_Size = keyof typeof SIZES;

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

				{/* <style jsx>
					{`
						:global(.dfr-Title--primary) {
							scroll-margin-top: 20px;
						}

						:global(.dfr-Title--primary):hover :global(a) {
							visibility: visible;
						}
					`}
				</style> */}
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
					"",
					{
						h1: "tw-text-4xl",
						h2: "tw-text-3xl",
						h3: "tw-text-2xl",
						h4: "tw-text-xl",
					}[tag],
				),
				SECONDARY: "",
				UNSTYLED: "",
			}[variant],
			v.isString(size) &&
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
		id: variant === VARIANTS.PRIMARY && v.isString(children) ? generateSlug(children) : id,
		className: classNames("tw-font-bold", generateStyles(is), className),
	};
}