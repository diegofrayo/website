import * as React from "react";
import cn from "classnames";

import v from "../v";
import type DR from "../types";

import { HTML_TAGS, T_HTMLTag } from "./constants";

const twcss: I_TWCSS = Object.assign(
	TWCSSCreator,
	HTML_TAGS.reduce(
		(result, tagName) => {
			return {
				...result,
				[tagName]: TWCSSCreator(tagName),
			};
		},
		{} as Record<T_HTMLTag, I_TWCSSComponentDefinition>,
	),
);

export default twcss;

// --- Components ---

function TWCSSCreator(Tag: T_ElementToRender): I_TWCSSComponentDefinition {
	const TWCSSComponentDefinition: I_TWCSSComponentDefinition = function TWCSSComponentDefinition(
		styles,
		staticProps = {},
	) {
		const TWCSSReactComponent: T_TWCSSReactComponent = React.forwardRef(
			function TWCSSReactComponent({ children, className = "", is, TWCSSVariant, ...rest }, ref) {
				/* WARN:
				 * This assertion is so useful and hard to remove
				 * I have no problem to use it
				 */
				const Element = (is || Tag) as DR.React.FunctionComponent<{
					[key: string]: unknown;
					ref: T_ReactForwardedRef;
				}>;
				const finalClassName = generateClassName({
					componentStyles: styles,
					classNameProp: className,
					TWCSSVariant,
					componentProps: rest as DR.Object,
				});

				return (
					<Element
						className={finalClassName}
						ref={ref}
						{...staticProps}
						{...rest}
					>
						{children}
					</Element>
				);
			},
		);

		return TWCSSReactComponent;
	};

	return TWCSSComponentDefinition;
}

// --- Utils ---

type T_GenerateClassNameParams = {
	componentStyles: T_StylesParam;
	classNameProp: string;
	TWCSSVariant: string | undefined;
	componentProps: DR.Object;
};

function generateClassName({
	componentStyles,
	classNameProp,
	TWCSSVariant,
	componentProps,
}: T_GenerateClassNameParams) {
	// twcss.a`x y z` | twcss.a("x y z")
	if (v.isArray(componentStyles) || v.isString(componentStyles)) {
		return cn(componentStyles.toString(), classNameProp);
	}

	// twcss.a({ $TWCSS_BASE_STYLES: "y", a: "a", b: "b" c: (props) => `a ${props.x ? "s" : "w"}`})
	if (v.isObject(componentStyles)) {
		const TWCSSVariantStyles = v.isString(TWCSSVariant) ? componentStyles[TWCSSVariant] : "";

		return cn(
			v.isString(componentStyles.$TWCSS_BASE_STYLES) && componentStyles.$TWCSS_BASE_STYLES,
			typeof TWCSSVariantStyles === "function"
				? TWCSSVariantStyles(componentProps)
				: TWCSSVariantStyles,
			classNameProp,
		);
	}

	// twcss.a``
	return cn(classNameProp);
}

// --- Types ---

interface I_TWCSSCreator {
	(Tag: T_ElementToRender): I_TWCSSComponentDefinition;
}

interface I_TWCSSComponentDefinition {
	(styles: T_StylesParam, staticProps?: DR.Object): T_TWCSSReactComponent;
}

type T_TWCSSReactComponent = DR.React.FunctionComponent<{
	children?: DR.React.Children;
	className?: string;
	TWCSSVariant?: string;
	is?: T_ElementToRender;
	[key: string]: unknown;
}>;

type T_StylesParam =
	| string
	| TemplateStringsArray
	| {
			$TWCSS_BASE_STYLES: T_StylesParamFunction;
			[key: string]: T_StylesParamFunction;
	  };

type T_StylesParamFunction = string | ((props: DR.Object) => string);

/*
 * WARN:
 * I don't know how to remove this any
 * styled-components also uses any to type this arg
 */
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T_ElementToRender = T_HTMLTag | T_ReactFunctionComponent<any> | any;

type T_ReactForwardedRef = React.ForwardedRef<unknown>;

interface I_TWCSS extends I_TWCSSCreator {
	a: I_TWCSSComponentDefinition;
	abbr: I_TWCSSComponentDefinition;
	address: I_TWCSSComponentDefinition;
	area: I_TWCSSComponentDefinition;
	article: I_TWCSSComponentDefinition;
	aside: I_TWCSSComponentDefinition;
	audio: I_TWCSSComponentDefinition;
	base: I_TWCSSComponentDefinition;
	bdi: I_TWCSSComponentDefinition;
	bdo: I_TWCSSComponentDefinition;
	big: I_TWCSSComponentDefinition;
	blockquote: I_TWCSSComponentDefinition;
	body: I_TWCSSComponentDefinition;
	br: I_TWCSSComponentDefinition;
	button: I_TWCSSComponentDefinition;
	canvas: I_TWCSSComponentDefinition;
	caption: I_TWCSSComponentDefinition;
	cite: I_TWCSSComponentDefinition;
	code: I_TWCSSComponentDefinition;
	col: I_TWCSSComponentDefinition;
	colgroup: I_TWCSSComponentDefinition;
	data: I_TWCSSComponentDefinition;
	datalist: I_TWCSSComponentDefinition;
	dd: I_TWCSSComponentDefinition;
	del: I_TWCSSComponentDefinition;
	details: I_TWCSSComponentDefinition;
	dfn: I_TWCSSComponentDefinition;
	dialog: I_TWCSSComponentDefinition;
	div: I_TWCSSComponentDefinition;
	dl: I_TWCSSComponentDefinition;
	dt: I_TWCSSComponentDefinition;
	em: I_TWCSSComponentDefinition;
	embed: I_TWCSSComponentDefinition;
	fieldset: I_TWCSSComponentDefinition;
	figcaption: I_TWCSSComponentDefinition;
	figure: I_TWCSSComponentDefinition;
	footer: I_TWCSSComponentDefinition;
	form: I_TWCSSComponentDefinition;
	h1: I_TWCSSComponentDefinition;
	h2: I_TWCSSComponentDefinition;
	h3: I_TWCSSComponentDefinition;
	h4: I_TWCSSComponentDefinition;
	h5: I_TWCSSComponentDefinition;
	h6: I_TWCSSComponentDefinition;
	head: I_TWCSSComponentDefinition;
	header: I_TWCSSComponentDefinition;
	hgroup: I_TWCSSComponentDefinition;
	hr: I_TWCSSComponentDefinition;
	html: I_TWCSSComponentDefinition;
	i: I_TWCSSComponentDefinition;
	iframe: I_TWCSSComponentDefinition;
	img: I_TWCSSComponentDefinition;
	input: I_TWCSSComponentDefinition;
	ins: I_TWCSSComponentDefinition;
	kbd: I_TWCSSComponentDefinition;
	keygen: I_TWCSSComponentDefinition;
	label: I_TWCSSComponentDefinition;
	legend: I_TWCSSComponentDefinition;
	li: I_TWCSSComponentDefinition;
	link: I_TWCSSComponentDefinition;
	main: I_TWCSSComponentDefinition;
	map: I_TWCSSComponentDefinition;
	mark: I_TWCSSComponentDefinition;
	marquee: I_TWCSSComponentDefinition;
	meta: I_TWCSSComponentDefinition;
	meter: I_TWCSSComponentDefinition;
	nav: I_TWCSSComponentDefinition;
	noscript: I_TWCSSComponentDefinition;
	object: I_TWCSSComponentDefinition;
	ol: I_TWCSSComponentDefinition;
	optgroup: I_TWCSSComponentDefinition;
	option: I_TWCSSComponentDefinition;
	output: I_TWCSSComponentDefinition;
	p: I_TWCSSComponentDefinition;
	param: I_TWCSSComponentDefinition;
	picture: I_TWCSSComponentDefinition;
	pre: I_TWCSSComponentDefinition;
	progress: I_TWCSSComponentDefinition;
	q: I_TWCSSComponentDefinition;
	rp: I_TWCSSComponentDefinition;
	rt: I_TWCSSComponentDefinition;
	ruby: I_TWCSSComponentDefinition;
	s: I_TWCSSComponentDefinition;
	samp: I_TWCSSComponentDefinition;
	script: I_TWCSSComponentDefinition;
	section: I_TWCSSComponentDefinition;
	select: I_TWCSSComponentDefinition;
	small: I_TWCSSComponentDefinition;
	source: I_TWCSSComponentDefinition;
	span: I_TWCSSComponentDefinition;
	strong: I_TWCSSComponentDefinition;
	style: I_TWCSSComponentDefinition;
	sub: I_TWCSSComponentDefinition;
	summary: I_TWCSSComponentDefinition;
	sup: I_TWCSSComponentDefinition;
	table: I_TWCSSComponentDefinition;
	tbody: I_TWCSSComponentDefinition;
	td: I_TWCSSComponentDefinition;
	textarea: I_TWCSSComponentDefinition;
	tfoot: I_TWCSSComponentDefinition;
	th: I_TWCSSComponentDefinition;
	thead: I_TWCSSComponentDefinition;
	time: I_TWCSSComponentDefinition;
	title: I_TWCSSComponentDefinition;
	tr: I_TWCSSComponentDefinition;
	track: I_TWCSSComponentDefinition;
	u: I_TWCSSComponentDefinition;
	ul: I_TWCSSComponentDefinition;
	var: I_TWCSSComponentDefinition;
	video: I_TWCSSComponentDefinition;
	wbr: I_TWCSSComponentDefinition;
	circle: I_TWCSSComponentDefinition;
	clipPath: I_TWCSSComponentDefinition;
	defs: I_TWCSSComponentDefinition;
	ellipse: I_TWCSSComponentDefinition;
	foreignObject: I_TWCSSComponentDefinition;
	g: I_TWCSSComponentDefinition;
	image: I_TWCSSComponentDefinition;
	line: I_TWCSSComponentDefinition;
	linearGradient: I_TWCSSComponentDefinition;
	mask: I_TWCSSComponentDefinition;
	path: I_TWCSSComponentDefinition;
	pattern: I_TWCSSComponentDefinition;
	polygon: I_TWCSSComponentDefinition;
	polyline: I_TWCSSComponentDefinition;
	radialGradient: I_TWCSSComponentDefinition;
	rect: I_TWCSSComponentDefinition;
	stop: I_TWCSSComponentDefinition;
	svg: I_TWCSSComponentDefinition;
	text: I_TWCSSComponentDefinition;
	tspan: I_TWCSSComponentDefinition;
}
