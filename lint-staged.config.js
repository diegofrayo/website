const baseConfig = ["prettier --write", "eslint"];

export default {
	"src/**/*.{ts,tsx}": baseConfig,
	"tests/**/*.{ts,tsx}": baseConfig,
};
