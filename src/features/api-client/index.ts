import authRouter from "./routes/auth";

const api = {
	website: {
		auth: authRouter,
	},
};

export default api;

// --- RE-EXPORTS ---

export * from "./routes/auth";
