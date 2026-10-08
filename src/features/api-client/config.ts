import axios from "axios";

export const ServerAPI = axios.create({
	baseURL: "/api/server",
});

ServerAPI.interceptors.request.use((config) => {
	return {
		...config,
		data: {
			...(config.data as Record<string, unknown>),
			$_ACTION: `${(config.method || "post").toUpperCase()}${config.url}`,
		},
		url: "",
	};
});
