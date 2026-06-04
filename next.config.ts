import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		disableStaticImages: true,
		remotePatterns: [new URL("https://dfrz-public.t3.tigrisfiles.io/**")],
	},
	experimental: {
		optimizePackageImports: ["lucide-react"],
	},
	modularizeImports: {
		"~/components/primitive": {
			transform: "~/components/primitive/{{kebabCase member}}",
			skipDefaultConversion: false,
			preventFullImport: true,
		},
		"@diegofrayo-pkg/hooks": {
			transform: "@diegofrayo-pkg/hooks/{{kebabCase member}}",
			skipDefaultConversion: false,
			preventFullImport: true,
		},
		"@diegofrayo-pkg/hocs": {
			transform: "@diegofrayo-pkg/hocs/{{kebabCase member}}",
			skipDefaultConversion: false,
			preventFullImport: true,
		},
	},
	allowedDevOrigins: ["website.local"],
};

export default nextConfig;
