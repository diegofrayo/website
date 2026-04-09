import cn from "@diegofrayo-pkg/cn";
import type ReactTypes from "@diegofrayo-pkg/types/react";
import { pipe, removeLastItem } from "@diegofrayo-pkg/utilities/fp";
import { isEmptyString, isNotEmptyString } from "@diegofrayo-pkg/validator";

import { Box, Link, Space, Title } from "~/components/primitive";
import AnalyticsService from "~/features/analytics";
import { useRouting } from "~/features/routing";

import Footer from "./components/footer";
import Header from "./components/header";

type MainLayoutProps = {
	children: ReactTypes.Children;
	className?: string;
	contentClassName?: string;
	title?: string;
};

function MainLayout({ children, className, contentClassName, title }: MainLayoutProps) {
	// --- COMPUTED STATES ---
	const HEADER_HEIGHT = 64;

	// --- STYLES ---
	const classes = {
		container: cn("min-h-dv-screen relative flex flex-col", className),
		content: cn("md:layout-with-max-width w-full flex-1 p-4", contentClassName),
	};

	return (
		<Box as="main">
			<Box className={classes.container}>
				<Header height={HEADER_HEIGHT} />

				<TitleSection
					title={title}
					style={{ paddingTop: HEADER_HEIGHT }}
				/>

				<Box className={classes.content}>{children}</Box>
				<Space size={8} />
				<Footer />
			</Box>
		</Box>
	);
}

export default MainLayout;

// --- COMPONENTS ---

type TitleSectionProps = {
	title: string | undefined;
	style?: ReactTypes.Styles;
};

function TitleSection({ title, style }: TitleSectionProps) {
	// --- HOOKS ---
	const { pathname } = useRouting();

	// --- COMPUTED STATES ---
	const parentURL = getParentURL(pathname);
	const showParentURL = isNotEmptyString(parentURL);

	// --- STYLES ---
	const classes = {
		root: cn("sm:pt-0 print:hidden"),
		title: cn("text-4xl uppercase", { "max-sm:text-2xl": title && title.length >= 10 }),
	};

	if (isEmptyString(title)) return null;

	return (
		<Box
			className={classes.root}
			style={style}
		>
			<Box className="layout-with-max-width w-full gap-2 px-4 py-12 text-center">
				{showParentURL && (
					<Box className="sm:hidden">
						<Link
							variant={Link.variant.SMOOTH}
							href={parentURL}
							className="spac inline-block font-mono text-sm font-bold tracking-wide underline"
							onClick={AnalyticsService.trackClickEvent("GENERAL|BREADCUMB_LINK", {
								link: parentURL,
							})}
						>
							{parentURL}
						</Link>
					</Box>
				)}

				<Title
					as="h1"
					variant={Title.variant.SIMPLE}
					className={classes.title}
				>
					{title}
				</Title>
			</Box>
		</Box>
	);
}

// --- UTILS ---

/**
 * @param pathname : "/" | "/blog" | "/blog/slug"
 * @returns string: pathname: "/" => output: "" | pathname: "/blog" => output: "/" | pathname: "/blog/slug" => output: "/blog/"
 */
function getParentURL(pathname: string) {
	if (pathname === "/") return "";

	const splitBySlashes = (pathname: string) => pathname.split("/").filter(isNotEmptyString);
	const joinPathname = (pathnameParts: string[]) => {
		if (pathnameParts.length === 0) return "/";
		return `/${pathnameParts.join("/")}/`;
	};

	const output = pipe(pathname, ...[splitBySlashes, removeLastItem, joinPathname]);

	return output;
}
