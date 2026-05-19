import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		disableStaticImages: true,
		remotePatterns: [new URL("https://dfrz-public.t3.tigrisfiles.io/**")],
	},
	experimental: {
		optimizePackageImports: ["~/components/primitive"],
	},
	allowedDevOrigins: ["website.local"],
};

export default nextConfig;
