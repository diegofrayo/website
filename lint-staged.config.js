const baseConfig = ["prettier --write", "eslint"];

const lintStagedConfig = {
	"src/**/*.{ts,tsx}": baseConfig,
	"tests/**/*.{ts,tsx}": baseConfig,
};

export default lintStagedConfig;
