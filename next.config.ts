import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	images: {
		disableStaticImages: true,
		remotePatterns: [new URL("https://ihzaehklbqrkvxrawczr.supabase.co/**")],
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
		"~/components/common": {
			transform: "~/components/common/{{kebabCase member}}",
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
