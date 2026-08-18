import actionsRouter from "./routes/actions";

const api = {
	website: {
		actions: actionsRouter,
	},
};

export default api;

// --- RE-EXPORTS ---

export * from "./routes/actions";
