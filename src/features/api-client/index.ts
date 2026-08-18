import actionsRouter from "./routes/actions";
import authRouter from "./routes/auth";

const api = {
	website: {
		actions: actionsRouter,
		auth: authRouter,
	},
};

export default api;

// --- RE-EXPORTS ---

export * from "./routes/actions";
export * from "./routes/auth";
