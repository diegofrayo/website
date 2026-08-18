import { useRouter } from "next/router";

import { Routes } from "./routing.constants";

type UseRoutingReturn = {
	asPath: string;
	pathname: string;
	isCurrentPathActive: (pathname: string) => boolean;
};

/**
 * Current href: http://localhost:3000/blog/sitios-para-visitar-en-el-quindio
 *
 * @returns {
 *   pathname: "/blog/[slug]",
 *   asPath:  "/blog/sitios-para-visitar-en-el-quindio",
 *   isCurrentPathActive: (pathname: string ('/blog')) => true
 * }
 */
export function useRouting(): UseRoutingReturn {
	// --- HOOKS ---
	const { pathname, asPath } = useRouter();

	// --- API ---
	function isCurrentPathActive(pathnameParam: string) {
		if (pathname === pathnameParam || asPath === pathnameParam) {
			return true;
		}

		if (pathname.startsWith(Routes.BLOG) && pathnameParam.startsWith(Routes.BLOG)) {
			return true;
		}

		return false;
	}

	return { pathname, asPath, isCurrentPathActive };
}
