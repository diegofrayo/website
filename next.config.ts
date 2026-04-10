import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		disableStaticImages: true,
		remotePatterns: [new URL("https://dfrz-public.t3.tigrisfiles.io/**")],
	},
	experimental: {
		optimizePackageImports: ["~/components/primitive"],
	},
	// modularizeImports: {
	// 	"~/components/primitive": {
	// 		transform: "~/components/primitive/{{lowerCase member}}",
	//    skipDefaultConversion: true,
	//    preventFullImport: true,
	// 	},
	// },
};

export default nextConfig;
